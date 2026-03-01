import logger from './utils/logger';
import { TelcelUsageData } from './utils/types';

export function validateUsageData(data: TelcelUsageData): boolean {
  try {
    if (!data.totalGB || data.totalGB <= 0) {
      logger.warn({ data }, 'Invalid totalGB value');
      return false;
    }

    if (data.usedGB < 0 || data.usedGB > data.totalGB * 1.5) {
      // Allow slight overage due to billing cycle timing
      logger.warn({ data }, 'usedGB out of reasonable range');
      return false;
    }

    if (data.percentageUsed < 0 || data.percentageUsed > 150) {
      logger.warn({ data }, 'percentageUsed out of range');
      return false;
    }

    if (!data.planName || data.planName.trim().length === 0) {
      logger.warn({ data }, 'Invalid planName');
      return false;
    }

    if (!data.expirationDate || isNaN(Date.parse(data.expirationDate))) {
      logger.warn({ data }, 'Invalid expirationDate');
      return false;
    }

    logger.info({ data }, 'Usage data validated successfully');
    return true;
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      'Error validating usage data'
    );
    return false;
  }
}

export function sanitizeUsageData(data: TelcelUsageData): TelcelUsageData {
  return {
    ...data,
    usedGB: Math.round(data.usedGB * 100) / 100,
    remainingGB: Math.round(data.remainingGB * 100) / 100,
    percentageUsed: Math.round(data.percentageUsed),
    lastUpdated: new Date().toISOString(),
  };
}

export function formatUsageForLogging(data: TelcelUsageData): string {
  return `Usage: ${data.usedGB.toFixed(2)}GB/${data.totalGB}GB (${data.percentageUsed}%) - Status: ${data.status}`;
}
