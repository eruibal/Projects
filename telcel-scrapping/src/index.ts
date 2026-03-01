import type { Request, Response } from '@google-cloud/functions-framework';
import * as functions from '@google-cloud/functions-framework';
import logger from './utils/logger';
import { handleError } from './utils/error-handler';
import { getTelcelUsageData } from './telcel-scraper';
import { sendUsageReport } from './gmail-sender';
import { validateUsageData, sanitizeUsageData, formatUsageForLogging } from './data-parser';
import { getSecretsFromEnv } from './utils/secrets-manager';

async function checkTelcelUsage(_req: Request, res: Response): Promise<void> {
  logger.info('Cloud Function triggered');

  try {
    // Get credentials from environment
    const {
      telcelUsername,
      telcelPassword,
      gmailSenderEmail,
      gmailAppPassword,
      recipientEmail,
    } = getSecretsFromEnv();

    // Step 1: Get usage data from Tel Cel portal
    logger.info('Starting Tel Cel data scraping');
    let usageData = await getTelcelUsageData(telcelUsername, telcelPassword);

    // Step 2: Validate and sanitize data
    if (!validateUsageData(usageData)) {
      throw new Error('Usage data validation failed');
    }

    usageData = sanitizeUsageData(usageData);
    logger.info(formatUsageForLogging(usageData));

    // Step 3: Send email report
    logger.info('Sending email report');
    await sendUsageReport(usageData, gmailSenderEmail, recipientEmail, gmailAppPassword);

    // Return success response
    logger.info('Cloud Function completed successfully');
    res.status(200).json({
      success: true,
      message: 'Daily data usage check completed successfully',
      data: {
        usedGB: usageData.usedGB,
        totalGB: usageData.totalGB,
        percentageUsed: usageData.percentageUsed,
        status: usageData.status,
      },
    });
  } catch (error) {
    const errorResponse = handleError(error);
    logger.error(errorResponse, 'Cloud Function error');

    res.status(errorResponse.statusCode).json({
      success: false,
      message: errorResponse.message,
      error: process.env.NODE_ENV === 'development' ? errorResponse.context : undefined,
    });
  }
}

// Register the function with the functions framework
functions.http('checkTelcelUsage', checkTelcelUsage);

// Allow direct execution for testing
export { checkTelcelUsage };
