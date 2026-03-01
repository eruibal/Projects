import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import logger from './logger';
import { ApplicationError } from './error-handler';

interface CachedSecret {
  value: string;
  expiresAt: number;
}

const secretCache = new Map<string, CachedSecret>();
const CACHE_TTL = 300000; // 5 minutes in milliseconds
let client: SecretManagerServiceClient | null = null;

function getClient(): SecretManagerServiceClient {
  if (!client) {
    client = new SecretManagerServiceClient();
  }
  return client;
}

export async function getSecret(secretName: string, projectId: string): Promise<string> {
  // Check cache first
  const cached = secretCache.get(secretName);
  if (cached && cached.expiresAt > Date.now()) {
    logger.debug(`Returning cached secret: ${secretName}`);
    return cached.value;
  }

  try {
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const client = getClient();
    const [version] = await client.accessSecretVersion({ name });

    const payload = version.payload?.data;
    if (!payload) {
      throw new ApplicationError(500, `Secret ${secretName} is empty`);
    }

    const secret = typeof payload === 'string' ? payload : Buffer.from(payload).toString('utf-8');

    // Cache the secret
    secretCache.set(secretName, {
      value: secret,
      expiresAt: Date.now() + CACHE_TTL,
    });

    logger.debug(`Retrieved and cached secret: ${secretName}`);
    return secret;
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : String(error) },
      `Failed to retrieve secret: ${secretName}`
    );
    throw new ApplicationError(500, `Failed to retrieve secret: ${secretName}`);
  }
}

export async function validateRequiredSecrets(
  requiredSecrets: string[],
  projectId: string
): Promise<void> {
  try {
    for (const secret of requiredSecrets) {
      await getSecret(secret, projectId);
    }
    logger.info(`All ${requiredSecrets.length} required secrets validated successfully`);
  } catch (error) {
    throw new ApplicationError(500, 'Failed to validate required secrets', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export function clearSecretCache(): void {
  secretCache.clear();
  logger.info('Secret cache cleared');
}

export function getSecretsFromEnv(): {
  telcelUsername: string;
  telcelPassword: string;
  gmailSenderEmail: string;
  gmailAppPassword: string;
  recipientEmail: string;
} {
  const telcelUsername = process.env.TELCEL_USERNAME;
  const telcelPassword = process.env.TELCEL_PASSWORD;
  const gmailSenderEmail = process.env.GMAIL_SENDER_EMAIL;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  if (!telcelUsername) throw new ApplicationError(500, 'TELCEL_USERNAME not set');
  if (!telcelPassword) throw new ApplicationError(500, 'TELCEL_PASSWORD not set');
  if (!gmailSenderEmail) throw new ApplicationError(500, 'GMAIL_SENDER_EMAIL not set');
  if (!gmailAppPassword) throw new ApplicationError(500, 'GMAIL_APP_PASSWORD not set');
  if (!recipientEmail) throw new ApplicationError(500, 'RECIPIENT_EMAIL not set');

  return {
    telcelUsername,
    telcelPassword,
    gmailSenderEmail,
    gmailAppPassword,
    recipientEmail,
  };
}
