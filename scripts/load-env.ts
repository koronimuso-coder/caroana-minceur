import * as fs from "fs";
import * as path from "path";

// Manually parse and load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    // Strip comments
    const cleanedLine = line.split("#")[0]?.trim();
    if (!cleanedLine) continue;

    const match = cleanedLine.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2]?.trim() || "";
      // Strip wrapping quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      if (key) {
        process.env[key] = value;
      }
    }
  }
}
