import logger from './logger';

export class ApplicationError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export function handleError(error: unknown): {
  statusCode: number;
  message: string;
  context?: Record<string, unknown>;
} {
  if (error instanceof ApplicationError) {
    logger.error(
      {
        error: error.message,
        context: error.context,
      },
      `Error: ${error.message}`
    );
    return {
      statusCode: error.statusCode,
      message: error.message,
      context: error.context,
    };
  }

  if (error instanceof Error) {
    logger.error({ error: error.message, stack: error.stack }, 'Unexpected error');
    return {
      statusCode: 500,
      message: error.message || 'An unexpected error occurred',
    };
  }

  logger.error({ error }, 'Unknown error type');
  return {
    statusCode: 500,
    message: 'An unknown error occurred',
  };
}

export function maskSensitiveData(obj: Record<string, unknown>): Record<string, unknown> {
  const masked = { ...obj };
  const sensitiveKeys = ['password', 'appPassword', 'token', 'secret', 'key'];

  Object.keys(masked).forEach((key) => {
    if (sensitiveKeys.some((sk) => key.toLowerCase().includes(sk))) {
      masked[key] = '***MASKED***';
    }
  });

  return masked;
}
