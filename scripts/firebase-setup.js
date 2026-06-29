/**
 * Firebase Auto-Setup Script
 * - Reads Firebase CLI refresh token from configstore
 * - Exchanges it for an access token via Google OAuth
 * - Enables Phone Authentication via Identity Toolkit API
 * - Creates a service account key for Firebase Admin SDK
 * - Updates .env.local automatically
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_ID = 'caroana-minceur';
const FIREBASE_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';
const ENV_LOCAL_PATH = path.join(__dirname, '..', '.env.local');

// ── Helper: HTTPS request ──────────────────────────────────────────────────

function httpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), raw: data });
        } catch {
          resolve({ status: res.statusCode, body: null, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ── Step 1: Read refresh token ─────────────────────────────────────────────

function getRefreshToken() {
  const configPath = path.join(os.homedir(), '.config', 'configstore', 'firebase-tools.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const refreshToken = config.tokens?.refresh_token;
  if (!refreshToken) throw new Error('No refresh token found in Firebase CLI configstore');
  console.log('✅ Refresh token found');
  return refreshToken;
}

// ── Step 2: Exchange refresh token for access token ────────────────────────

async function getAccessToken(refreshToken) {
  const body = new URLSearchParams({
    client_id: FIREBASE_CLIENT_ID,
    client_secret: FIREBASE_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  }).toString();

  const res = await httpsRequest({
    hostname: 'oauth2.googleapis.com',
    path: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
    },
  }, body);

  if (res.status !== 200 || !res.body?.access_token) {
    throw new Error(`Failed to get access token: ${res.raw}`);
  }

  console.log('✅ Access token obtained');
  return res.body.access_token;
}

// ── Step 3: Enable Phone Auth via Identity Toolkit API ────────────────────

async function enablePhoneAuth(accessToken) {
  console.log('🔄 Enabling Phone Authentication...');

  // First GET the current config
  const getRes = await httpsRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: `/admin/v2/projects/${PROJECT_ID}/config`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (getRes.status !== 200) {
    console.warn('⚠️  Could not GET Identity Toolkit config:', getRes.raw.substring(0, 200));
    // Try the v1 API instead
    return enablePhoneAuthV1(accessToken);
  }

  const currentConfig = getRes.body;
  
  // Build patch to enable phone auth
  const signInConfig = currentConfig.signIn || {};
  const phoneNumber = signInConfig.phoneNumber || {};
  phoneNumber.enabled = true;
  phoneNumber.testPhoneNumbers = phoneNumber.testPhoneNumbers || {};
  signInConfig.phoneNumber = phoneNumber;
  currentConfig.signIn = signInConfig;

  const patchRes = await httpsRequest({
    hostname: 'identitytoolkit.googleapis.com',
    path: `/admin/v2/projects/${PROJECT_ID}/config?updateMask=signIn.phoneNumber.enabled`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }, JSON.stringify({ signIn: { phoneNumber: { enabled: true } } }));

  if (patchRes.status === 200) {
    console.log('✅ Phone Authentication enabled successfully');
    return true;
  } else {
    console.warn('⚠️  PATCH failed, trying v1 API:', patchRes.raw.substring(0, 300));
    return enablePhoneAuthV1(accessToken);
  }
}

async function enablePhoneAuthV1(accessToken) {
  // Try the older Firebase Auth REST API
  const body = JSON.stringify({
    enabledProviders: ['phone'],
  });

  const res = await httpsRequest({
    hostname: 'firebase.googleapis.com',
    path: `/v1beta1/projects/${PROJECT_ID}/defaultSupportedIdpConfigs/phone?updateMask=enabled`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }, JSON.stringify({ enabled: true }));

  if (res.status === 200) {
    console.log('✅ Phone Auth enabled via v1 API');
    return true;
  }

  console.warn('⚠️  Could not enable Phone Auth automatically. Status:', res.status, res.raw.substring(0, 200));
  console.log('   → You can enable it at: https://console.firebase.google.com/project/caroana-minceur/authentication/providers');
  return false;
}

// ── Step 4: List service accounts ─────────────────────────────────────────

async function getAdminServiceAccount(accessToken) {
  console.log('🔄 Looking up Firebase Admin service account...');

  const res = await httpsRequest({
    hostname: 'iam.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/serviceAccounts`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 200) {
    throw new Error(`Failed to list service accounts: ${res.raw.substring(0, 300)}`);
  }

  const accounts = res.body.accounts || [];
  console.log(`   Found ${accounts.length} service account(s)`);
  
  // Find the firebase-adminsdk account
  const adminAccount = accounts.find(a => 
    a.email.includes('firebase-adminsdk') || 
    a.email.includes('firebase-admin')
  );

  if (!adminAccount) {
    console.log('   Available accounts:', accounts.map(a => a.email).join(', '));
    throw new Error('Firebase Admin SDK service account not found');
  }

  console.log(`✅ Found service account: ${adminAccount.email}`);
  return adminAccount;
}

// ── Step 5: Create service account key ────────────────────────────────────

async function createServiceAccountKey(accessToken, serviceAccountEmail) {
  console.log('🔄 Creating service account key...');

  const encodedEmail = encodeURIComponent(serviceAccountEmail);
  const res = await httpsRequest({
    hostname: 'iam.googleapis.com',
    path: `/v1/projects/${PROJECT_ID}/serviceAccounts/${encodedEmail}/keys`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }, JSON.stringify({ keyAlgorithm: 'KEY_ALG_RSA_2048', privateKeyType: 'TYPE_GOOGLE_CREDENTIALS_FILE' }));

  if (res.status !== 200) {
    throw new Error(`Failed to create key: ${res.raw.substring(0, 400)}`);
  }

  // The privateKeyData is base64-encoded JSON
  const keyData = Buffer.from(res.body.privateKeyData, 'base64').toString('utf8');
  const keyJson = JSON.parse(keyData);
  
  console.log('✅ Service account key created');
  return keyJson;
}

// ── Step 6: Update .env.local ──────────────────────────────────────────────

function updateEnvLocal(keyJson) {
  console.log('🔄 Updating .env.local with real credentials...');

  let envContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');

  // Replace FIREBASE_ADMIN_PROJECT_ID
  envContent = envContent.replace(
    /^FIREBASE_ADMIN_PROJECT_ID=.*/m,
    `FIREBASE_ADMIN_PROJECT_ID=${keyJson.project_id}`
  );

  // Replace FIREBASE_ADMIN_CLIENT_EMAIL  
  envContent = envContent.replace(
    /^FIREBASE_ADMIN_CLIENT_EMAIL=.*/m,
    `FIREBASE_ADMIN_CLIENT_EMAIL=${keyJson.client_email}`
  );

  // Replace FIREBASE_ADMIN_PRIVATE_KEY (escape newlines for .env format)
  const escapedKey = keyJson.private_key.replace(/\n/g, '\\n');
  envContent = envContent.replace(
    /^FIREBASE_ADMIN_PRIVATE_KEY=.*(\n|$)/m,
    `FIREBASE_ADMIN_PRIVATE_KEY="${escapedKey}"\n`
  );

  fs.writeFileSync(ENV_LOCAL_PATH, envContent, 'utf8');
  console.log('✅ .env.local updated with real Firebase Admin credentials');

  // Save the full key JSON as backup (in .gitignore'd location)
  const keyBackupPath = path.join(__dirname, '..', 'firebase-admin-key.json');
  fs.writeFileSync(keyBackupPath, JSON.stringify(keyJson, null, 2));
  console.log(`✅ Key backup saved to firebase-admin-key.json (add to .gitignore!)`);
}

// ── Step 7: Ensure firebase-admin-key.json is in .gitignore ───────────────

function ensureGitignore() {
  const gitignorePath = path.join(__dirname, '..', '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    let content = fs.readFileSync(gitignorePath, 'utf8');
    if (!content.includes('firebase-admin-key.json')) {
      content += '\n# Firebase Admin SDK key (sensitive - never commit!)\nfirebase-admin-key.json\n';
      fs.writeFileSync(gitignorePath, content);
      console.log('✅ Added firebase-admin-key.json to .gitignore');
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Firebase Auto-Setup Script\n' + '='.repeat(40));
  
  try {
    const refreshToken = getRefreshToken();
    const accessToken = await getAccessToken(refreshToken);
    
    // Run in parallel where possible
    const [, serviceAccount] = await Promise.all([
      enablePhoneAuth(accessToken),
      getAdminServiceAccount(accessToken),
    ]);

    const keyJson = await createServiceAccountKey(accessToken, serviceAccount.email);
    updateEnvLocal(keyJson);
    ensureGitignore();

    console.log('\n' + '='.repeat(40));
    console.log('🎉 Setup complete! Firebase Admin SDK is fully configured.');
    console.log(`   Project: ${keyJson.project_id}`);
    console.log(`   Account: ${keyJson.client_email}`);
    console.log('\n   Restart your dev server for changes to take effect.');
    console.log('='.repeat(40) + '\n');
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
