import 'dotenv/config';
import logger from './utils/logger';
import { getTelcelUsageData } from './telcel-scraper';

(async () => {
  try {
    const username = process.env.TELCEL_USERNAME;
    const password = process.env.TELCEL_PASSWORD;

    if (!username || !password) {
      logger.error('TELCEL_USERNAME and TELCEL_PASSWORD must be set in environment');
      process.exit(1);
    }

    logger.info('Starting Telcel scraper runner');
    const data = await getTelcelUsageData(username, password);
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    logger.error({ err: err instanceof Error ? err.message : String(err) }, 'Runner failed');
    process.exit(2);
  }
})();
