#!/usr/bin/env node
// Publishes the last Playwright run as a versioned report that can be committed.
//
//   npm run report:publish                     label "local"
//   npm run report:publish -- --label sprint-3
//
// Reads  playwright-report/ (html, results.json, junit.xml) produced by `npx playwright test`.
// Writes reports/<YYYY-MM-DD_HHmm>-<label>/
//          html/          the full HTML report (steps, screenshots, traces of failures)
//          summary.md     results table, failures, evidence list
//          results.json, junit.xml
//        reports/LATEST.md  pointer to the newest run
//        reports/index.md   history of runs (newest first)
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const labelAt = args.indexOf('--label');
const label = (labelAt >= 0 && args[labelAt + 1] ? args[labelAt + 1] : 'local').replace(/[^\w.-]+/g, '-');
const source = 'playwright-report';
const resultsFile = path.join(source, 'results.json');

if (!fs.existsSync(resultsFile)) {
  console.error(`No ${resultsFile}. Run the tests first: npx playwright test`);
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
const pad = (n) => String(n).padStart(2, '0');
const started = new Date(results.stats?.startTime ?? Date.now());
const stamp = `${started.getFullYear()}-${pad(started.getMonth() + 1)}-${pad(started.getDate())}_${pad(started.getHours())}${pad(started.getMinutes())}`;
const runName = `${stamp}-${label}`;
const target = path.join('reports', runName);

// ---- collect tests -------------------------------------------------------
const rows = [];
const walk = (suite, titles = []) => {
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      const last = t.results?.at(-1) ?? {};
      const status = t.status === 'expected' ? 'passed'
        : t.status === 'skipped' ? 'skipped'
        : t.status === 'flaky' ? 'flaky'
        : 'failed';
      rows.push({
        title: spec.title,
        file: spec.file,
        project: t.projectName,
        tags: [...(spec.tags ?? []), ...(t.tags ?? [])].map((x) => (x.startsWith('@') ? x : `@${x}`)),
        status,
        duration: last.duration ?? 0,
        error: (last.errors?.[0]?.message ?? last.error?.message ?? '').replace(/\x1b\[[0-9;]*m/g, '').split('\n').filter(Boolean).slice(0, 3).join(' '),
        evidence: (last.attachments ?? []).filter((a) => a.contentType === 'image/png' && a.name !== 'screenshot').map((a) => a.name),
      });
    }
  }
  for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
};
for (const suite of results.suites ?? []) walk(suite);

const real = rows.filter((r) => r.project !== 'setup');
const count = (s) => real.filter((r) => r.status === s).length;
const knownBugs = real.filter((r) => r.tags.includes('@bug') && r.status === 'failed');
const unexpected = real.filter((r) => r.status === 'failed' && !r.tags.includes('@bug'));
const verdict = unexpected.length ? 'FAILED' : 'PASSED';
const secs = (ms) => `${(ms / 1000).toFixed(1)} s`;
const esc = (s) => String(s).replace(/\|/g, '\\|');

// ---- summary.md ----------------------------------------------------------
const lines = [
  `# Test run ${runName}`,
  '',
  `**Result:** ${verdict} · Passed ${count('passed')} · Failed ${count('failed')} (known bugs ${knownBugs.length}) · Flaky ${count('flaky')} · Skipped ${count('skipped')} · Duration ${secs(results.stats?.duration ?? 0)}`,
  '',
  `Open the full report: [html/index.html](html/index.html) (or \`npx playwright show-report ${path.join(target, 'html').replace(/\\/g, '/')}\`).`,
  '',
  '## Results',
  '| Status | Test | Project | Duration | Evidence |',
  '|---|---|---|---|---|',
  ...real.map((r) => `| ${{ passed: '✅', failed: r.tags.includes('@bug') ? '🐞' : '❌', flaky: '⚠️', skipped: '⏭️' }[r.status]} ${r.status} | ${esc(r.title)} | ${r.project} | ${secs(r.duration)} | ${r.evidence.length} |`),
  '',
];
if (knownBugs.length) {
  lines.push('## Known bugs (fail until fixed)', ...knownBugs.map((r) => `- **${esc(r.title)}** (${r.project}): ${esc(r.error)}`), '');
}
if (unexpected.length) {
  lines.push('## Unexpected failures', ...unexpected.map((r) => `- **${esc(r.title)}** (${r.project}): ${esc(r.error)}`), '');
}
lines.push('## Evidence attached to the report', ...real.filter((r) => r.evidence.length).map((r) => `- ${esc(r.title)} (${r.project}): ${r.evidence.join(', ')}`), '');

// ---- write ---------------------------------------------------------------
fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, path.join(target, 'html'), {
  recursive: true,
  filter: (src) => !/results\.json$|junit\.xml$/.test(src),
});
for (const f of ['results.json', 'junit.xml']) if (fs.existsSync(path.join(source, f))) fs.copyFileSync(path.join(source, f), path.join(target, f));
fs.writeFileSync(path.join(target, 'summary.md'), lines.join('\n'));

// reports/LATEST.md points to the newest run (a pointer, not a copy, to keep the repository small).
const runLink = runName;
fs.writeFileSync(
  path.join('reports', 'LATEST.md'),
  `# Latest run: ${runName}\n\n**${verdict}** · Passed ${count('passed')} · Failed ${count('failed')} (known bugs ${knownBugs.length})\n\n- Summary: [${runLink}/summary.md](${runLink}/summary.md)\n- HTML report: [${runLink}/html/index.html](${runLink}/html/index.html)\n`,
);
const oldLatest = path.join('reports', 'latest');
if (fs.existsSync(oldLatest)) fs.rmSync(oldLatest, { recursive: true, force: true });

const indexFile = path.join('reports', 'index.md');
const header = '# Test reports\n\nNewest first. Each run keeps the HTML report, the summary and the raw results.\n\n| Run | Result | Passed | Failed | Known bugs | Summary |\n|---|---|---|---|---|---|\n';
const previous = fs.existsSync(indexFile) ? fs.readFileSync(indexFile, 'utf8').split('\n').filter((l) => /^\| \[/.test(l)) : [];
const row = `| [${runName}](${runName}/html/index.html) | ${verdict} | ${count('passed')} | ${count('failed')} | ${knownBugs.length} | [summary](${runName}/summary.md) |`;
fs.writeFileSync(indexFile, header + [row, ...previous.filter((l) => !l.includes(`[${runName}]`))].join('\n') + '\n');

console.log(`Published ${target} (${verdict}: ${count('passed')} passed, ${count('failed')} failed, ${knownBugs.length} known bugs).`);
console.log('Also updated reports/LATEST.md and reports/index.md.');
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join('\n') + '\n');
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `unexpected=${unexpected.length}\nknown_bugs=${knownBugs.length}\ndir=${target.replace(/\\/g, '/')}\n`);
// Known-bug specs (@bug) never fail the run; any other failure does when --fail-on-unexpected is given.
if (args.includes('--fail-on-unexpected') && unexpected.length) process.exit(1);
