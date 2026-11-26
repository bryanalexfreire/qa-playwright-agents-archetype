#!/usr/bin/env node
// Removes the worked examples (examples/ and their published reports) and leaves the clean archetype.
// Works on Windows, macOS and Linux.
//
//   npm run example:remove -- --dry-run   list what would change, change nothing
//   npm run example:remove                asks for confirmation
//   npm run example:remove -- --yes       no prompt
//
// Steps: 1) delete examples/ and the reports of the example runs
//        2) remove the <!-- example:start --> ... <!-- example:end --> blocks of Markdown files
//        3) remove the example npm scripts from package.json
//        4) delete this script
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

const args = new Set(process.argv.slice(2));
const dry = args.has('--dry-run') || args.has('--dry');
const yes = args.has('--yes') || args.has('-y');

const MARKED = ['README.md', 'CHANGELOG.md'];
const SCRIPTS = ['test:example', 'test:api', 'example:remove'];
const reportRuns = fs.existsSync('reports')
  ? fs
      .readdirSync('reports', { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => path.join('reports', e.name))
  : [];
const reportFiles = ['reports/index.md', 'reports/LATEST.md'].filter((f) => fs.existsSync(f));
const hasExamples = fs.existsSync('examples');

if (!hasExamples && !reportRuns.length) {
  console.log('The examples are not present: the archetype is already clean.');
  process.exit(0);
}

console.log('Worked examples\n\nWill delete:');
if (hasExamples) console.log('  - examples/');
for (const r of [...reportRuns, ...reportFiles]) console.log(`  - ${r}`);
console.log(`Will clean the example blocks in: ${MARKED.join(', ')}`);
console.log(`Will remove the npm scripts: ${SCRIPTS.join(', ')}`);
console.log('Will delete: scripts/remove-example.mjs\n');

if (dry) {
  console.log('Dry run: nothing changed.');
  process.exit(0);
}
if (!yes) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question('Remove the examples? (y/N) ')).trim().toLowerCase();
  rl.close();
  if (answer !== 'y' && answer !== 'yes') {
    console.log('Cancelled.');
    process.exit(0);
  }
}

// 1) Files and folders
if (hasExamples) fs.rmSync('examples', { recursive: true, force: true });
for (const r of [...reportRuns, ...reportFiles]) fs.rmSync(r, { recursive: true, force: true });

// 2) Example blocks in Markdown files
for (const file of MARKED) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, text.replace(/\r?\n?<!-- example:start -->[\s\S]*?<!-- example:end -->\r?\n?/g, '\n'));
}

// 3) npm scripts of the examples
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const name of SCRIPTS) delete pkg.scripts[name];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

console.log('\nExamples removed. The archetype is clean.');
console.log('Next: npm run typecheck && npm run lint:specs, then commit the removal on a feature branch.');

// 4) This script
fs.rmSync(fileURLToPath(import.meta.url), { force: true });
