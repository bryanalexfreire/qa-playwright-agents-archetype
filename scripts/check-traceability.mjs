// Fails if a test title has no requirement ID ("<REQ-ID> · ...") or a bug test has no BUG-ID.
// Run: npm run lint:specs
import fs from 'node:fs';
import path from 'node:path';

const root = 'tests';
const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.spec.ts')) files.push(full);
  }
};
if (fs.existsSync(root)) walk(root);

const titleRe = /\btest(?:\.(?:only|skip|fixme))?\(\s*(['"`])(.+?)\1/g;
const problems = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(titleRe)) {
    const title = match[2];
    const inBugs = file.split(path.sep).includes('bugs');
    if (inBugs && !/^BUG-\d{3}\b/.test(title)) problems.push(`${file}: "${title}" must start with BUG-XXX`);
    if (!inBugs && !/^[A-Z][A-Z0-9]*(-[A-Z0-9]+)*-\d+\s·\s/.test(title)) problems.push(`${file}: "${title}" must start with "<REQ-ID> · "`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log(`Traceability OK (${files.length} spec files).`);
