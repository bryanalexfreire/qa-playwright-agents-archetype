// npm run setup [-- chromium firefox ...]
// 1. Downloads Playwright's browsers (all, or the ones given) with their OS dependencies.
// 2. If the download fails and PW_DOWNLOAD_MIRROR is set (.env or environment), retries through that mirror.
// 3. Prints which browser every project will use: Playwright's build, or for the Chromium projects the
//    installed Chrome / Edge when the build is missing (see src/support/browsers.ts).
// Exit code: 0 when the browsers were installed; 1 when the download failed (the summary says what still works).
import 'dotenv/config';
import { spawnSync } from 'node:child_process';

const browsers = process.argv.slice(2);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const run = (args, env = process.env) =>
  spawnSync(npx, args, { stdio: 'inherit', env, shell: process.platform === 'win32' }).status;

const install = (env) => run(['playwright', 'install', '--with-deps', ...browsers], env);

let status = install(process.env);
const mirror = process.env.PW_DOWNLOAD_MIRROR;
if (status !== 0 && mirror && !process.env.PLAYWRIGHT_DOWNLOAD_HOST) {
  console.warn(`\n[setup] Download failed; retrying through the mirror ${mirror}`);
  status = install({ ...process.env, PLAYWRIGHT_DOWNLOAD_HOST: mirror });
}

console.log('\n[setup] Browser of each project:');
run(['playwright', 'test', '--list', '--project=unit'], { ...process.env, PW_PRINT_BROWSERS: '1' });

if (status !== 0) {
  console.error(
    '\n[setup] Playwright browsers could not be downloaded. Chromium projects still run on the installed Chrome or Edge ' +
      '(if any, see above); Firefox and WebKit need the download. Set PW_DOWNLOAD_MIRROR to an internal mirror and run "npm run setup" again.',
  );
}
process.exit(status ?? 1);
