const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const envLocalPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.error('.env.local not found');
  process.exit(1);
}

const envContent = fs.readFileSync(envLocalPath, 'utf8');
const lines = envContent.split(/\r?\n/);

const targets = ['production', 'development'];

function runCommand(cmd, args) {
  return new Promise((resolve) => {
    // Spawn the command instead of exec to get real-time stream control
    const proc = spawn(cmd, args, { shell: true });
    let resolved = false;

    const cleanupAndResolve = (code) => {
      if (!resolved) {
        resolved = true;
        try {
          proc.kill();
        } catch (e) {}
        resolve(code);
      }
    };

    proc.stdout.on('data', (data) => {
      const str = data.toString();
      process.stdout.write(str);
      
      // Auto-kill when we see the completion markers
      if (
        str.includes('Added Environment Variable') || 
        str.includes('already exists') || 
        str.includes('Common next commands')
      ) {
        // Give it a tiny moment to finish writing
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

    // Timeout safety net: 10 seconds per variable
    setTimeout(() => {
      cleanupAndResolve(2);
    }, 10000);
  });
}

async function main() {
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    value = value.replace(/\\n/g, '\n');
    
    for (const target of targets) {
      let pushValue = value;
      if (key === 'NEXT_PUBLIC_APP_URL' && target === 'production') {
        pushValue = 'https://caroana-minceur.vercel.app';
      }
      
      console.log(`\n--- Adding ${key} to ${target} ---`);
      
      const args = [
        'env',
        'add',
        key,
        target,
        '--value',
        pushValue,
        '--yes'
      ];
      
      await runCommand('vercel', args);
    }
  }
  console.log('\nEnvironment variable synchronization complete!');
}

main().catch(console.error);
