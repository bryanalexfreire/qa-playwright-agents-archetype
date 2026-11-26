import { test, expect } from '@playwright/test';
import path from 'node:path';
import {
  browsersRoot,
  missingBundledMessage,
  resolveChromium,
  resolveVideo,
  systemBrowserLocations,
} from '../../src/support/browsers';

// Unit tests of the browser resolution (no browser needed): npm run test:unit

const none = { chrome: false, msedge: false };

test.describe('resolveChromium', () => {
  test('uses Playwright Chromium when it is installed', () => {
    const r = resolveChromium({ bundledInstalled: true, installed: { chrome: true, msedge: true } });
    expect(r.source).toBe('bundled');
    expect(r.channel).toBeUndefined();
  });

  test('falls back to the installed Chrome when Playwright Chromium is missing', () => {
    const r = resolveChromium({ bundledInstalled: false, installed: { chrome: true, msedge: true } });
    expect(r).toMatchObject({ source: 'system', channel: 'chrome' });
    expect(r.message).toContain('Google Chrome');
  });

  test('falls back to Edge when there is no Chrome', () => {
    const r = resolveChromium({ bundledInstalled: false, installed: { chrome: false, msedge: true } });
    expect(r).toMatchObject({ source: 'system', channel: 'msedge' });
  });

  test('explains the fix when no Chromium browser is available', () => {
    const r = resolveChromium({ bundledInstalled: false, installed: none });
    expect(r.source).toBe('missing');
    expect(r.message).toContain('npm run setup');
    expect(r.message).toContain('PLAYWRIGHT_DOWNLOAD_HOST');
  });

  test('honours a forced system channel that is installed', () => {
    const r = resolveChromium({
      forced: ' MSEDGE ',
      bundledInstalled: true,
      installed: { chrome: true, msedge: true },
    });
    expect(r).toMatchObject({ source: 'forced', channel: 'msedge' });
  });

  test('reports a forced channel that is not installed instead of silently changing browser', () => {
    const r = resolveChromium({ forced: 'chrome', bundledInstalled: true, installed: none });
    expect(r.source).toBe('missing');
    expect(r.message).toContain('Google Chrome is not installed');
  });

  test('rejects an unknown forced channel', () => {
    const r = resolveChromium({ forced: 'opera', bundledInstalled: true, installed: none });
    expect(r.source).toBe('missing');
    expect(r.message).toContain('not valid');
  });

  test('forcing chromium needs Playwright Chromium', () => {
    expect(resolveChromium({ forced: 'chromium', bundledInstalled: true, installed: none }).source).toBe('forced');
    expect(resolveChromium({ forced: 'chromium', bundledInstalled: false, installed: none }).source).toBe('missing');
  });
});

test.describe('system browsers and messages', () => {
  test('looks for Chrome and Edge in the Windows program folders', () => {
    const env = { ProgramFiles: 'C:\\PF', 'ProgramFiles(x86)': 'C:\\PF86', LOCALAPPDATA: 'C:\\Local' };
    const locations = systemBrowserLocations(env, 'win32');
    expect(locations.chrome).toHaveLength(3);
    expect(locations.msedge.some((p) => p.includes('PF86') && p.endsWith('msedge.exe'))).toBe(true);
  });

  test('uses the standard Linux and macOS install paths', () => {
    expect(systemBrowserLocations({}, 'linux').chrome).toContain('/usr/bin/google-chrome');
    expect(systemBrowserLocations({}, 'darwin').msedge[0]).toContain('Microsoft Edge.app');
  });

  test('says there is no system fallback for Firefox and WebKit', () => {
    expect(missingBundledMessage('webkit')).toContain('no system fallback');
  });
});

test.describe('video and browsers folder', () => {
  test('keeps the configured video when ffmpeg is installed', () => {
    expect(resolveVideo('retain-on-failure', true)).toEqual({ video: 'retain-on-failure' });
  });

  test('turns video off with a message when ffmpeg is missing', () => {
    const r = resolveVideo('retain-on-failure', false);
    expect(r.video).toBe('off');
    expect(r.message).toContain('ffmpeg');
  });

  test('finds the browsers folder from the Chromium executable', () => {
    const exe = path.join('root', 'ms-playwright', 'chromium-1254', 'chrome-win64', 'chrome.exe');
    expect(browsersRoot(exe)).toBe(path.join('root', 'ms-playwright'));
    expect(browsersRoot(path.join('somewhere', 'chrome.exe'))).toBeUndefined();
  });
});
