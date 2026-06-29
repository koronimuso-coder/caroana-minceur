const fs = require('fs');
const path = require('path');

const base = 'C:\\Users\\NYAMMA\\AppData\\Local\\pnpm\\store\\v11\\links\\@\\firebase-tools\\15.22.0\\32a1b777af20b6846862494760c72cf4adf6a748';

function findFiles(dir, name, results = []) {
  try {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) findFiles(full, name, results);
        else if (f === name) results.push(full);
      } catch {}
    }
  } catch {}
  return results;
}

const files = findFiles(base, 'api.js');
console.log('Found:', files.length, 'api.js files');

for (const file of files.slice(0, 3)) {
  const content = fs.readFileSync(file, 'utf8');
  
  // Look for client secret patterns
  const patterns = [
    /GOOGLE_CLIENT_SECRET\s*=\s*["']([^"']+)["']/,
    /clientSecret\s*:\s*["']([^"']+)["']/,
    /client_secret\s*:\s*["']([^"']+)["']/,
    /"client_secret"\s*:\s*"([^"]+)"/,
  ];
  
  for (const p of patterns) {
    const m = content.match(p);
    if (m) {
      console.log('Found in', path.basename(path.dirname(file)), '->', file.substring(0, 100));
      console.log('CLIENT_SECRET:', m[1]);
      break;
    }
  }
  
  // Also look for CLIENT_ID
  const idMatch = content.match(/GOOGLE_CLIENT_ID\s*=\s*["']([^"']+)["']/);
  if (idMatch) console.log('CLIENT_ID:', idMatch[1]);
}
