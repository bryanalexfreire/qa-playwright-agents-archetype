#!/usr/bin/env node
// Connects the vendor-neutral agent files of this repository to the folder and rules file your
// agent client expects, on THIS machine only. Works on Windows, macOS and Linux.
//
//   node scripts/link-agents.mjs <client-folder> <client-rules-file>
//   node scripts/link-agents.mjs --remove <client-folder> <client-rules-file>
//   (or: npm run agents:link -- <client-folder> <client-rules-file>)
//
// It creates, and never commits:
//   <client-folder>      -> link to .agents/   (agents, skills, settings; a junction on Windows)
//   <client-rules-file>  -> hard link to AGENTS.md (a copy when hard links are not possible)
// and adds both names to .git/info/exclude so they stay out of every commit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const remove = args[0] === '--remove';
const [clientDir, clientRules] = remove ? args.slice(1) : args;

if (!clientDir || !clientRules) {
  console.error(
    'Usage:\n  node scripts/link-agents.mjs <client-folder> <client-rules-file>\n  node scripts/link-agents.mjs --remove <client-folder> <client-rules-file>',
  );
  process.exit(1);
}

const dirPath = path.join(root, clientDir);
const rulesPath = path.join(root, clientRules);
const excludeFile = path.join(root, '.git', 'info', 'exclude');
const exists = (p) => fs.existsSync(p) || fs.lstatSync(p, { throwIfNoEntry: false }) !== undefined;

if (remove) {
  if (exists(dirPath)) fs.rmSync(dirPath, { force: true }); // removes the link, never the target
  if (exists(rulesPath)) fs.rmSync(rulesPath, { force: true });
  console.log(`Removed the local links "${clientDir}" and "${clientRules}". The repository files are untouched.`);
  process.exit(0);
}

if (exists(dirPath)) {
  console.error(
    `"${clientDir}" already exists. Remove it first: node scripts/link-agents.mjs --remove ${clientDir} ${clientRules}`,
  );
  process.exit(1);
}
fs.mkdirSync(path.dirname(dirPath), { recursive: true });
fs.symlinkSync(path.join(root, '.agents'), dirPath, process.platform === 'win32' ? 'junction' : 'dir');

if (exists(rulesPath)) {
  console.log(`"${clientRules}" already exists; left unchanged.`);
} else {
  fs.mkdirSync(path.dirname(rulesPath), { recursive: true });
  try {
    fs.linkSync(path.join(root, 'AGENTS.md'), rulesPath);
  } catch {
    fs.copyFileSync(path.join(root, 'AGENTS.md'), rulesPath);
    console.log(`Hard link not possible here: "${clientRules}" is a copy. Copy AGENTS.md again after you edit it.`);
  }
}

if (fs.existsSync(path.dirname(excludeFile))) {
  const current = fs.existsSync(excludeFile) ? fs.readFileSync(excludeFile, 'utf8') : '';
  const lines = new Set(current.split(/\r?\n/));
  const missing = [`/${clientDir}`, `/${clientRules}`].map((l) => l.replace(/\\/g, '/')).filter((l) => !lines.has(l));
  if (missing.length)
    fs.appendFileSync(excludeFile, (current.endsWith('\n') || !current ? '' : '\n') + missing.join('\n') + '\n');
  console.log('Added to .git/info/exclude (local only, never committed).');
} else {
  console.warn('WARNING: no .git folder yet. Run this again after "git init" so the links stay out of commits.');
}
console.log(`Linked: ${clientDir} -> .agents   and   ${clientRules} -> AGENTS.md`);
