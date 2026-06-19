const { spawn } = require('child_process');

const variables = [
  {
    key: 'FIREBASE_ADMIN_PRIVATE_KEY',
    value: `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC3devkeyhere...\n-----END PRIVATE KEY-----\n`.replace(/\\n/g, '\n')
  },
  {
    key: 'EMAIL_FROM',
    value: 'CAROANA MINCEUR <contact@caroana-minceur.com>'
  }
];

const targets = ['production', 'development'];

function runCommand(cmd, args) {
  return new Promise((resolve) => {
    // Windows vercel CLI is vercel.cmd
    const proc = spawn('vercel.cmd', args, { shell: false });
    let resolved = false;

    const cleanupAndResolve = (code) => {
      if (!resolved) {
        resolved = true;
        try { proc.kill(); } catch (e) {}
        resolve(code);
      }
    };

    proc.stdout.on('data', (data) => {
      const str = data.toString();
      process.stdout.write(str);
      if (str.includes('Added Environment Variable') || str.includes('already exists') || str.includes('Common next commands')) {
        setTimeout(() => cleanupAndResolve(0), 100);
      }
    });

    proc.stderr.on('data', (data) => {
      const str = data.toString();
      process.stderr.write(str);
      if (str.toLowerCase().includes('error') || str.includes('failed')) {
        setTimeout(() => cleanupAndResolve(1), 100);
      }
    });

    proc.on('exit', (code) => {
      cleanupAndResolve(code || 0);
    });

    setTimeout(() => {
      cleanupAndResolve(2);
    }, 15000);
  });
}

async function main() {
  for (const item of variables) {
    for (const target of targets) {
      console.log(`\n--- Adding ${item.key} to ${target} (no-shell) ---`);
      const args = [
        'env',
        'add',
        item.key,
        target,
        '--value',
        item.value,
        '--yes'
      ];
      await runCommand('vercel', args);
    }
  }
  console.log('Special env vars complete!');
}

main().catch(console.error);
