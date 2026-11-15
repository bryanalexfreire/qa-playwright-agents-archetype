import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { chromium, firefox, webkit } from '@playwright/test';

/**
 * Browser resolution: decides which browser each project runs on, so a run does not fail
 * just because Playwright's browsers could not be downloaded.
 *
 * Chromium projects (desktop and mobile emulation):
 *   1. Playwright's bundled Chromium (installed with `npm run setup`), the reference browser;
 *   2. if it is missing (no Internet, blocked CDN), the installed Google Chrome, then Microsoft Edge
 *      (Playwright `channel`, any version works: Playwright drives them over CDP, no driver);
 *   3. otherwise a clear message with the fix.
 * Firefox and WebKit have no system fallback (Playwright needs its own patched builds):
 * if they are missing, a clear message says how to install them.
 *
 * Video recording needs Playwright's ffmpeg (also part of `npm run setup`): without it every page fails
 * to open, so video is turned off with a warning; traces and screenshots keep working.
 *
 * Force a browser with PW_CHROMIUM_CHANNEL=chromium | chrome | msedge.
 */

export type VideoMode = 'off' | 'on' | 'retain-on-failure' | 'on-first-retry';

export type ChromiumChannel = 'chromium' | 'chrome' | 'msedge';

export interface ChromiumInput {
  /** Value of PW_CHROMIUM_CHANNEL, if set. */
  forced?: string;
  /** Playwright's bundled Chromium is installed. */
  bundledInstalled: boolean;
  /** Installed system browsers. */
  installed: { chrome: boolean; msedge: boolean };
}

export interface ChromiumResolution {
  /** `use.channel` for the Chromium projects (undefined = Playwright's bundled Chromium). */
  channel?: 'chrome' | 'msedge';
  source: 'bundled' | 'system' | 'forced' | 'missing';
  message: string;
}

const FIX =
  'Run "npm run setup" to install Playwright\'s browsers. If the download is blocked, set PLAYWRIGHT_DOWNLOAD_HOST ' +
  'to an internal mirror, or install Google Chrome or Microsoft Edge (used automatically as fallback).';

/** Pure decision, covered by tests/unit/browsers.test.ts. */
export function resolveChromium(input: ChromiumInput): ChromiumResolution {
  const forced = input.forced?.trim().toLowerCase();
  if (forced) {
    if (forced === 'chromium') {
      return input.bundledInstalled
        ? { source: 'forced', message: 'Chromium projects: Playwright Chromium (forced)' }
        : { source: 'missing', message: `PW_CHROMIUM_CHANNEL=chromium but Playwright Chromium is not installed. ${FIX}` };
    }
    if (forced === 'chrome' || forced === 'msedge') {
      return input.installed[forced]
        ? { channel: forced, source: 'forced', message: `Chromium projects: installed ${label(forced)} (forced)` }
        : { source: 'missing', message: `PW_CHROMIUM_CHANNEL=${forced} but ${label(forced)} is not installed.` };
    }
    return { source: 'missing', message: `PW_CHROMIUM_CHANNEL="${input.forced}" is not valid; use chromium, chrome or msedge.` };
  }
  if (input.bundledInstalled) {
    return { source: 'bundled', message: 'Chromium projects: Playwright Chromium' };
  }
  for (const channel of ['chrome', 'msedge'] as const) {
    if (input.installed[channel]) {
      return {
        channel,
        source: 'system',
        message: `Playwright Chromium is not installed; Chromium projects run on the installed ${label(channel)}.`,
      };
    }
  }
  return { source: 'missing', message: `No Chromium browser available: Playwright Chromium is not installed and neither is Chrome or Edge. ${FIX}` };
}

/** Video setting to use: the configured one, or "off" when ffmpeg is missing (pure, unit tested). */
export function resolveVideo(configured: VideoMode, ffmpegInstalled: boolean): { video: VideoMode; message?: string } {
  if (configured === 'off' || ffmpegInstalled) return { video: configured };
  return {
    video: 'off',
    message: 'Playwright ffmpeg is not installed: video recording is off for this run (traces and screenshots still work). Run "npm run setup".',
  };
}

/** Folder with Playwright's browsers, derived from the Chromium executable path (<root>/chromium-<rev>/...). */
export function browsersRoot(chromiumExecutable: string): string | undefined {
  let dir = path.dirname(chromiumExecutable);
  while (dir !== path.dirname(dir)) {
    if (path.basename(dir).startsWith('chromium-')) return path.dirname(dir);
    dir = path.dirname(dir);
  }
  return undefined;
}

/** True when the ffmpeg build required by this Playwright version is installed. */
export function ffmpegInstalled(): boolean {
  const root = browsersRoot(chromium.executablePath());
  if (!root) return false;
  const require = createRequire(import.meta.url);
  const manifest = path.join(path.dirname(require.resolve('playwright-core/package.json')), 'browsers.json');
  const ffmpeg = (JSON.parse(fs.readFileSync(manifest, 'utf8')).browsers as { name: string; revision: string }[])
    .find((b) => b.name === 'ffmpeg');
  return !!ffmpeg && exists(path.join(root, `ffmpeg-${ffmpeg.revision}`));
}

/** Message for Firefox / WebKit when Playwright's build is missing (no system fallback exists). */
export function missingBundledMessage(name: 'firefox' | 'webkit'): string {
  return `Playwright ${name} is not installed: the ${name} projects will fail. Run "npm run setup" ` +
    '(or set PLAYWRIGHT_DOWNLOAD_HOST to a mirror). There is no system fallback for this browser.';
}

/** Usual install locations of the system browsers that Playwright can drive with `channel`. */
export function systemBrowserLocations(env: NodeJS.ProcessEnv = process.env, platform: string = process.platform) {
  if (platform === 'win32') {
    const roots = [env['ProgramFiles'], env['ProgramFiles(x86)'], env['LOCALAPPDATA']].filter(Boolean) as string[];
    return {
      chrome: roots.map((r) => path.join(r, 'Google', 'Chrome', 'Application', 'chrome.exe')),
      msedge: roots.map((r) => path.join(r, 'Microsoft', 'Edge', 'Application', 'msedge.exe')),
    };
  }
  if (platform === 'darwin') {
    return {
      chrome: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
      msedge: ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
    };
  }
  return {
    chrome: ['/opt/google/chrome/chrome', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'],
    msedge: ['/opt/microsoft/msedge/msedge', '/usr/bin/microsoft-edge', '/usr/bin/microsoft-edge-stable'],
  };
}

const exists = (file: string): boolean => {
  try {
    return fs.existsSync(file);
  } catch {
    return false;
  }
};

/** What is installed on this machine (Playwright's browsers and the system ones). */
export function detectBrowsers() {
  const locations = systemBrowserLocations();
  return {
    bundled: {
      chromium: exists(chromium.executablePath()),
      firefox: exists(firefox.executablePath()),
      webkit: exists(webkit.executablePath()),
    },
    installed: {
      chrome: locations.chrome.some(exists),
      msedge: locations.msedge.some(exists),
    },
  };
}

/**
 * Resolves the browsers for playwright.config.ts and prints, once per run, which browser the
 * Chromium projects use and what is missing.
 */
export function browserStrategy(video: VideoMode): {
  chromiumUse: { channel?: 'chrome' | 'msedge' };
  video: VideoMode;
  messages: string[];
} {
  const found = detectBrowsers();
  const chromiumResolution = resolveChromium({
    forced: process.env.PW_CHROMIUM_CHANNEL,
    bundledInstalled: found.bundled.chromium,
    installed: found.installed,
  });
  const messages = [chromiumResolution.message];
  if (!found.bundled.firefox) messages.push(missingBundledMessage('firefox'));
  if (!found.bundled.webkit) messages.push(missingBundledMessage('webkit'));
  const videoResolution = resolveVideo(video, ffmpegInstalled());
  if (videoResolution.message) messages.push(videoResolution.message);
  return {
    chromiumUse: chromiumResolution.channel ? { channel: chromiumResolution.channel } : {},
    video: videoResolution.video,
    messages,
  };
}

function label(channel: 'chrome' | 'msedge'): string {
  return channel === 'chrome' ? 'Google Chrome' : 'Microsoft Edge';
}
