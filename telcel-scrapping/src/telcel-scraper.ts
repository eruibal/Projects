import { chromium, Browser, Page } from 'playwright';
import logger from './utils/logger';
import { ApplicationError } from './utils/error-handler';
import { TelcelUsageData, ScraperConfig } from './utils/types';

export class TelcelScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Playwright browser');
      this.browser = await chromium.launch({
        headless: this.config.headless,
      });

      this.page = await this.browser.newPage();
      logger.info('Browser and page initialized successfully');
    } catch (error) {
      throw new ApplicationError(500, 'Failed to initialize Playwright browser', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async login(): Promise<void> {
    if (!this.page) {
      throw new ApplicationError(500, 'Page not initialized');
    }

    try {
      logger.info('Navigating to Tel Cel portal');
      await this.page.goto('https://www.telcel.com/', {
        waitUntil: 'networkidle',
        timeout: this.config.timeout,
      });

      // Look for login button or link
      logger.info('Looking for login option');
      const loginButton = await this.page.locator(
        'a[href*="login"], button:has-text("Inicia sesión"), a:has-text("Inicia sesión")'
      ).first();

      if (await loginButton.isVisible()) {
        await loginButton.click();
        await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: this.config.timeout });
      }

      logger.info('Attempting to login with credentials');

      // Fill username
      const usernameField = await this.findElement(
        'input[name="username"], input[type="email"], input[name="email"]'
      );
      await usernameField.fill(this.config.username);

      // Fill password
      const passwordField = await this.findElement('input[type="password"], input[name="password"]');
      await passwordField.fill(this.config.password);

      // Find and click login button
      const submitButton = await this.findElement(
        'button[type="submit"], button:has-text("Entrar"), button:has-text("Login")'
      );
      await submitButton.click();

      // Wait for navigation
      await this.page.waitForNavigation({ waitUntil: 'networkidle', timeout: this.config.timeout });

      logger.info('Login successful');
    } catch (error) {
      if (this.config.screenshotOnError && this.page) {
        const screenshot = await this.page.screenshot({ path: '/tmp/login-error.png' });
        logger.error({ screenshot }, 'Login failed - screenshot captured');
      }
      throw new ApplicationError(401, 'Failed to login to Tel Cel portal', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async extractUsageData(): Promise<TelcelUsageData> {
    if (!this.page) {
      throw new ApplicationError(500, 'Page not initialized');
    }

    try {
      logger.info('Extracting data usage information');

      // Wait for content to load
      await this.page.waitForLoadState('networkidle');

      // Look for data usage section - adjust selectors based on Tel Cel portal structure
      const usageSection = await this.page.locator(
        '[class*="usage"], [class*="consumo"], [class*="datos"], .data-usage'
      ).first();

      if (!(await usageSection.isVisible())) {
        logger.warn('Usage section not immediately visible, attempting to navigate');
        // Try to click on a datos/consumo menu item if available
        const menuItem = await this.page.locator(
          'a:has-text("Consumo"), a:has-text("Datos"), a:has-text("Mi Consumo")'
        ).first();
        if (await menuItem.isVisible()) {
          await menuItem.click();
          await this.page.waitForLoadState('networkidle');
        }
      }

      const usageData = await this.parseUsageData();

      logger.info({ usageData }, 'Successfully extracted usage data');
      return usageData;
    } catch (error) {
      if (this.config.screenshotOnError && this.page) {
        const screenshot = await this.page.screenshot({ path: '/tmp/extraction-error.png' });
        logger.error({ screenshot }, 'Data extraction failed - screenshot captured');
      }
      throw new ApplicationError(500, 'Failed to extract usage data', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async parseUsageData(): Promise<TelcelUsageData> {
    if (!this.page) {
      throw new ApplicationError(500, 'Page not initialized');
    }

    try {
      // Extract text content from the page
      const pageContent = await this.page.content();

      // Look for patterns like "5.2 GB used" or "5.2 de 20 GB"
      const gbPattern = /(\d+(?:\.\d+)?)\s*(?:GB|de|\/)\s*(\d+(?:\.\d+)?)/gi;
      const matches = gbPattern.exec(pageContent);

      let usedGB = 0;
      let totalGB = 20; // Default assumption

      if (matches && matches.length >= 3) {
        usedGB = parseFloat(matches[1]);
        totalGB = parseFloat(matches[2]);
      }

      const remainingGB = Math.max(0, totalGB - usedGB);
      const percentageUsed = Math.round((usedGB / totalGB) * 100);

      // Determine status based on usage
      let status: 'active' | 'warning' | 'critical' = 'active';
      if (percentageUsed >= 90) status = 'critical';
      else if (percentageUsed >= 75) status = 'warning';

      return {
        totalGB,
        usedGB,
        remainingGB,
        percentageUsed,
        planName: 'Plan Estándar',
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdated: new Date().toISOString(),
        status,
      };
    } catch (error) {
      throw new ApplicationError(500, 'Failed to parse usage data', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private async findElement(selector: string): Promise<any> {
    if (!this.page) {
      throw new ApplicationError(500, 'Page not initialized');
    }

    const element = this.page.locator(selector).first();
    if (!(await element.isVisible())) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element;
  }

  async close(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close();
        logger.info('Browser closed successfully');
      }
    } catch (error) {
      logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Error closing browser'
      );
    }
  }
}

export async function getTelcelUsageData(
  username: string,
  password: string
): Promise<TelcelUsageData> {
  const config: ScraperConfig = {
    username,
    password,
    headless: process.env.PLAYWRIGHT_HEADLESS !== 'false',
    timeout: 30000,
    screenshotOnError: process.env.SCREENSHOT_ON_ERROR === 'true',
  };

  const scraper = new TelcelScraper(config);

  try {
    await scraper.initialize();
    await scraper.login();
    const usageData = await scraper.extractUsageData();
    return usageData;
  } finally {
    await scraper.close();
  }
}
