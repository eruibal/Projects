#!/usr/bin/env node

/**
 * Quick Playwright login script for https://mitelcel.com
 *
 * Usage:
 *   MITELCEL_USER="your-user" MITELCEL_PASS="your-pass" node mitelcel-login.js
 *
 * Optional:
 *   HEADLESS=false BROWSER_CHANNEL=chrome DEBUG_SNAPSHOT=true node mitelcel-login.js
 */

const { chromium } = require('playwright');

const BASE_URL = process.env.MITELCEL_URL || 'https://www.mitelcel.com';
const USERNAME = process.env.MITELCEL_USER;
const PASSWORD = process.env.MITELCEL_PASS;
const HEADLESS = process.env.HEADLESS !== 'false';
const BROWSER_CHANNEL = process.env.BROWSER_CHANNEL;
const DEBUG_SNAPSHOT = process.env.DEBUG_SNAPSHOT === 'true';

const URL_CANDIDATES = [
  BASE_URL,
  'https://www.mitelcel.com',
  'https://mitelcel.com'
].filter((value, index, arr) => value && arr.indexOf(value) === index);

if (!USERNAME || !PASSWORD) {
  console.error('Missing credentials. Set MITELCEL_USER and MITELCEL_PASS environment variables.');
  process.exit(1);
}

function allFrames(page) {
  return [page.mainFrame(), ...page.frames().filter((f) => f !== page.mainFrame())];
}

async function fillFirstVisibleInAnyFrame(page, selectors, value) {
  for (const frame of allFrames(page)) {
    for (const selector of selectors) {
      try {
        const locator = frame.locator(selector).first();
        if (await locator.count()) {
          await locator.fill(value);
          return { selector, frameUrl: frame.url() || 'main-frame' };
        }
      } catch (_) {
        // Continue scanning selectors and frames.
      }
    }
  }
  return null;
}

async function clickFirstVisibleInAnyFrame(page, selectors) {
  for (const frame of allFrames(page)) {
    for (const selector of selectors) {
      try {
        const locator = frame.locator(selector).first();
        if (await locator.count()) {
          await locator.click({ timeout: 3000 });
          return { selector, frameUrl: frame.url() || 'main-frame' };
        }
      } catch (_) {
        // Continue scanning selectors and frames.
      }
    }
  }
  return null;
}

async function pressEnterOnPasswordField(page) {
  const passwordSelectors = [
    'input[type="password"]',
    'input[name="password" i]',
    'input[id="password"]',
    'input[id*="pass" i]'
  ];

  for (const frame of allFrames(page)) {
    for (const selector of passwordSelectors) {
      try {
        const locator = frame.locator(selector).first();
        if (await locator.count()) {
          await locator.focus();
          await locator.press('Enter');
          return { selector, frameUrl: frame.url() || 'main-frame' };
        }
      } catch (_) {
        // Continue scanning selectors and frames.
      }
    }
  }
  return null;
}

async function jsClickEntrarFallback(page) {
  for (const frame of allFrames(page)) {
    try {
      const clicked = await frame.evaluate(() => {
        const candidates = Array.from(document.querySelectorAll('a, button, input[type="submit"]'));
        const target = candidates.find((el) => {
          const txt = (el.textContent || '').trim().toLowerCase();
          const val = (el.getAttribute('value') || '').trim().toLowerCase();
          return txt === 'entrar' || val === 'entrar';
        });
        if (!target) return false;
        target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        return true;
      });
      if (clicked) {
        return { selector: 'js-click(Entrar)', frameUrl: frame.url() || 'main-frame' };
      }
    } catch (_) {
      // Ignore frame eval errors.
    }
  }
  return null;
}

async function submitFormFallback(page) {
  for (const frame of allFrames(page)) {
    try {
      const submitted = await frame.evaluate(() => {
        const pass = document.querySelector('input[type="password"], input[name="password"], input#password');
        const form = pass ? pass.closest('form') : document.querySelector('form');
        if (!form) return false;

        if (typeof form.requestSubmit === 'function') {
          form.requestSubmit();
          return true;
        }

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        if (typeof form.submit === 'function') {
          form.submit();
          return true;
        }

        return false;
      });

      if (submitted) {
        return { selector: 'form.requestSubmit()', frameUrl: frame.url() || 'main-frame' };
      }
    } catch (_) {
      // Ignore cross-origin/evaluation errors.
    }
  }
  return null;
}

async function printDebugSnapshot(page) {
  const frames = allFrames(page);
  console.log('Current URL:', page.url());
  console.log('Page title:', await page.title());
  console.log('Frame URLs:', frames.map((f) => f.url()).filter(Boolean));

  try {
    const iframeSrcs = await page.$$eval('iframe', (els) =>
      els.map((el) => el.getAttribute('src') || '').filter(Boolean)
    );
    console.log('Iframe src attributes:', iframeSrcs);
  } catch (_) {
    console.log('Could not read iframe src attributes.');
  }

  for (const [idx, frame] of frames.entries()) {
    try {
      const links = await frame.$$eval('a, button', (els) =>
        els
          .map((el) => ({
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
            href: el.getAttribute('href') || ''
          }))
          .filter((item) => item.text)
          .slice(0, 20)
      );

      const inputs = await frame.$$eval('input', (els) =>
        els.slice(0, 20).map((el) => ({
          type: el.type || '',
          name: el.name || '',
          id: el.id || '',
          placeholder: el.placeholder || ''
        }))
      );

      console.log(`Frame[${idx}] ${frame.url() || 'main-frame'} links/buttons:`, links);
      console.log(`Frame[${idx}] ${frame.url() || 'main-frame'} inputs:`, inputs);
    } catch (_) {
      console.log(`Frame[${idx}] ${frame.url() || 'unknown'} could not be inspected.`);
    }
  }
}

async function getIframeLoginSrc(page) {
  const src = await page
    .locator('iframe[src*="wbl.telcel-id.com" i], iframe[src*="telcel-id.com" i]')
    .first()
    .getAttribute('src')
    .catch(() => null);

  if (!src) return null;
  try {
    return new URL(src, page.url()).toString();
  } catch (_) {
    return null;
  }
}

async function tryFillCredentials(page) {
  const userMatch = await fillFirstVisibleInAnyFrame(page, [
    'input[type="email"]',
    'input[type="tel"]',
    'input[type="text"]',
    'input[name="email" i]',
    'input[name="username" i]',
    'input[name="user" i]',
    'input[name="numero" i]',
    'input[name="telefono" i]',
    'input[name="msisdn" i]',
    'input[name*="msisdn" i]',
    'input[id*="user" i]',
    'input[id*="email" i]',
    'input[id*="phone" i]',
    'input[id*="tel" i]',
    'input[id*="numero" i]',
    'input[id*="msisdn" i]',
    'input[placeholder*="correo" i]',
    'input[placeholder*="usuario" i]',
    'input[placeholder*="telefono" i]',
    'input[placeholder*="celular" i]',
    'input[placeholder*="10" i]'
  ], USERNAME);

  const passMatch = await fillFirstVisibleInAnyFrame(page, [
    'input[type="password"]',
    'input[name="password" i]',
    'input[name="contrasena" i]',
    'input[name="contraseña" i]',
    'input[name="nip" i]',
    'input[id*="pass" i]',
    'input[id*="pwd" i]',
    'input[id*="nip" i]',
    'input[placeholder*="contraseña" i]',
    'input[placeholder*="contrasena" i]',
    'input[placeholder*="password" i]',
    'input[placeholder*="nip" i]'
  ], PASSWORD);

  return { userMatch, passMatch };
}

async function submitLogin(page) {
  let submitMatch = await clickFirstVisibleInAnyFrame(page, [
    'input[type="submit"]',
    'button[type="submit"]',
    'a:has-text("Entrar")',
    'a >> text=Entrar',
    'button:has-text("Entrar")',
    'a:has-text("Ingresar")',
    'button:has-text("Iniciar sesión")',
    'button:has-text("Iniciar sesion")',
    'button:has-text("Acceder")',
    'button:has-text("Continuar")'
  ]);
  if (submitMatch) return { ...submitMatch, mode: 'click' };

  submitMatch = await jsClickEntrarFallback(page);
  if (submitMatch) return { ...submitMatch, mode: 'js-click' };

  submitMatch = await pressEnterOnPasswordField(page);
  if (submitMatch) return { ...submitMatch, mode: 'enter' };

  submitMatch = await submitFormFallback(page);
  if (submitMatch) return { ...submitMatch, mode: 'form-submit' };

  return null;
}

async function isStillOnTelcelLogin(page) {
  const url = page.url();
  const urlLooksLikeLogin =
    /wbl\.telcel-id\.com:8443\/login/i.test(url) ||
    /\/mitelcel\/login/i.test(url);

  if (!urlLooksLikeLogin) return false;

  // Check if the login iframe is still mounted with a password field visible
  for (const frame of allFrames(page)) {
    try {
      const hasPassword = await frame.locator('input[type="password"], input[name="password"], input#password').count();
      if (hasPassword > 0) return true;
    } catch (_) {
      // Ignore frame errors.
    }
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({
    headless: HEADLESS,
    slowMo: 80,
    ...(BROWSER_CHANNEL ? { channel: BROWSER_CHANNEL } : {})
  });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    let loadedUrl = null;
    let lastNavError = null;

    for (const candidate of URL_CANDIDATES) {
      try {
        console.log(`Opening ${candidate} ...`);
        await page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 60000 });
        loadedUrl = page.url();
        break;
      } catch (err) {
        lastNavError = err;
        console.log(`Navigation failed for ${candidate}: ${err.message.split('\n')[0]}`);
      }
    }

    if (!loadedUrl) {
      throw new Error(`All entry URLs failed. Last error: ${lastNavError ? lastNavError.message : 'unknown error'}`);
    }

    const antiBotDetected = /validate\.perfdrive\.com|captcha|radware/i.test(page.url());
    if (antiBotDetected) {
      if (HEADLESS) {
        throw new Error(`Blocked by anti-bot challenge at ${page.url()}. Re-run with HEADLESS=false.`);
      }
      console.log('Anti-bot challenge detected. Please solve it in the browser window.');
      await page.waitForURL(
        (url) => {
          const href = url.href.toLowerCase();
          return href.includes('mitelcel.com') && !href.includes('validate.perfdrive.com');
        },
        { timeout: 240000 }
      );
      console.log('Challenge cleared. Continuing login flow...');
    }

    const loginEntry = await clickFirstVisibleInAnyFrame(page, [
      'a:has-text("Mi Telcel")',
      'a:has-text("Mi cuenta")',
      'a:has-text("Iniciar sesión")',
      'a:has-text("Iniciar sesion")',
      'a:has-text("Ingresar")',
      'button:has-text("Mi Telcel")',
      'button:has-text("Mi cuenta")',
      'button:has-text("Iniciar sesión")',
      'button:has-text("Iniciar sesion")',
      'button:has-text("Ingresar")',
      'a[href*="login" i]',
      'a[href*="micuenta" i]',
      'a[href*="mi-cuenta" i]',
      'button[data-testid*="login" i]'
    ]);

    if (loginEntry) {
      console.log(`Opened login form using ${loginEntry.selector} on ${loginEntry.frameUrl}`);
      await page.waitForLoadState('domcontentloaded');
    } else {
      console.log('No login entry button detected, attempting direct form fill.');
    }

    let loggedIn = false;

    // --- Strategy 1: fill credentials in any already-loaded frame ---
    let { userMatch, passMatch } = await tryFillCredentials(page);

    if (userMatch && passMatch) {
      console.log(`Filled username with ${userMatch.selector} on ${userMatch.frameUrl}`);
      console.log(`Filled password with ${passMatch.selector} on ${passMatch.frameUrl}`);
      const submit = await submitLogin(page);
      if (submit) {
        console.log(`Submitted login using ${submit.selector} on ${submit.frameUrl}`);
        loggedIn = true;
      }
    }

    // --- Strategy 2: use Playwright frameLocator to operate inside the iframe ---
    // (preserves mitelcel.com parent session — required for post-login redirect to work)
    if (!loggedIn) {
      console.log('Falling back to frameLocator strategy (iframe in parent page context)...');

      // Navigate to the page that hosts the login iframe if we drifted away.
      const currentUrl = page.url();
      if (!currentUrl.includes('mitelcel.com') || currentUrl.includes('wbl.telcel-id.com')) {
        await page.goto('https://www.mitelcel.com/mitelcel/login', {
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
      }

      const frameSelector =
        'iframe[src*="wbl.telcel-id.com" i], iframe[src*="telcel-id.com" i]';

      try {
        await page.waitForSelector(frameSelector, { timeout: 20000 });
      } catch (_) {
        // Iframe may already be present.
      }

      // Get the actual frame object (not frameLocator) for direct interaction
      let telcelFrame = null;
      // Wait up to 15s for the frame to register and load
      for (let i = 0; i < 30; i++) {
        telcelFrame = page.frames().find((f) => /wbl\.telcel-id\.com/i.test(f.url()));
        if (telcelFrame) break;
        await page.waitForTimeout(500);
      }

      if (!telcelFrame) {
        throw new Error('Telcel ID iframe frame object not found after waiting.');
      }

      // Wait for username field to be visible inside frame
      const userLocator = telcelFrame.locator('input[name="username"]').first();
      await userLocator.waitFor({ state: 'visible', timeout: 15000 });

      // Click to focus, clear, then type character-by-character to trigger all input/change events
      await userLocator.click();
      await userLocator.fill('');
      await userLocator.pressSequentially(USERNAME, { delay: 60 });
      console.log('Filled username via real keystrokes');

      // Tab to password field (triggers blur/validate on username)
      await userLocator.press('Tab');

      const passLocator = telcelFrame.locator('input[name="password"]').first();
      await passLocator.waitFor({ state: 'visible', timeout: 5000 });
      await passLocator.click();
      await passLocator.fill('');
      await passLocator.pressSequentially(PASSWORD, { delay: 60 });
      console.log('Filled password via real keystrokes');

      // Tab away from password so blur/validation fires
      await passLocator.press('Tab');
      await page.waitForTimeout(800);

      // Click Entrar with proper hover → click sequence (no force, real mouse movement)
      const entrarLocator = telcelFrame.locator('a:has-text("Entrar"), button[type="submit"], input[type="submit"]').first();
      await entrarLocator.waitFor({ state: 'visible', timeout: 5000 });
      await entrarLocator.scrollIntoViewIfNeeded();
      await entrarLocator.hover();
      await page.waitForTimeout(200);
      await entrarLocator.click();
      console.log('Submitted login via Entrar click (hover → click)');

      loggedIn = true;
    }

    // Wait for the login iframe to disappear — the clearest signal that auth succeeded
    const iframeGone = page
      .waitForSelector(
        'iframe[src*="wbl.telcel-id.com" i], iframe[src*="telcel-id.com" i]',
        { state: 'detached', timeout: 30000 }
      )
      .catch(() => null);

    const urlChanged = page
      .waitForURL((u) => !/\/mitelcel\/login/i.test(u.href), { timeout: 30000 })
      .catch(() => null);

    await Promise.race([iframeGone, urlChanged]);

    if (await isStillOnTelcelLogin(page)) {
      throw new Error('Login did not advance — credentials may be wrong, a CAPTCHA is present, or MFA is required.');
    }

    console.log('Login flow executed. Current URL:', page.url());

    if (!HEADLESS) {
      console.log('Browser will stay open. Close the browser window to exit.');
      await new Promise((resolve) => browser.once('disconnected', resolve));
      return; // browser already closed, skip the finally close
    }
  } catch (err) {
    console.error('Login script failed:', err.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
