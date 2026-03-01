import nodemailer from 'nodemailer';
import logger from './utils/logger';
import { ApplicationError } from './utils/error-handler';
import { TelcelUsageData, EmailConfig } from './utils/types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

export class GmailSender {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  private async createTransporter() {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.config.senderEmail,
          pass: this.config.appPassword,
        },
      });

      // Verify connection
      await transporter.verify();
      logger.info('Gmail SMTP connection verified');
      return transporter;
    } catch (error) {
      throw new ApplicationError(500, 'Failed to create Gmail transporter', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private formatEmailBody(data: TelcelUsageData): string {
    const usagePercentage = data.percentageUsed;
    const progressColor = data.status === 'critical' ? '#ff4444' : data.status === 'warning' ? '#ff9900' : '#00aa00';

    const statusMessage = {
      critical: '🚨 Critical! Your data usage is very high.',
      warning: '⚠️ Warning! Your data usage is approaching the limit.',
      active: '✅ Your data usage is normal.',
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: white; padding: 20px; border-radius: 5px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px; }
    .usage-card {
      background: white;
      border: 2px solid ${progressColor};
      padding: 20px;
      border-radius: 8px;
      margin: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .usage-stat {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .usage-stat:last-child { border-bottom: none; }
    .label { font-weight: bold; }
    .value { color: ${progressColor}; font-weight: bold; }
    .progress-bar {
      width: 100%;
      height: 20px;
      background-color: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    .progress-fill {
      height: 100%;
      width: ${usagePercentage}%;
      background-color: ${progressColor};
      transition: width 0.3s ease;
    }
    .footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .alert {
      background-color: ${data.status === 'critical' ? '#ffe6e6' : data.status === 'warning' ? '#fff3e0' : '#e6f7e6'};
      border-left: 4px solid ${progressColor};
      padding: 15px;
      margin: 15px 0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📱 Daily Data Usage Report</h1>
      <p>Tel Cel Data Monitor</p>
    </div>

    <div class="content">
      <div class="alert">
        <strong>${statusMessage[data.status]}</strong>
      </div>

      <div class="usage-card">
        <h2>Current Usage</h2>

        <div class="usage-stat">
          <span class="label">Used:</span>
          <span class="value">${data.usedGB.toFixed(2)} GB</span>
        </div>

        <div class="usage-stat">
          <span class="label">Total Plan:</span>
          <span class="value">${data.totalGB} GB</span>
        </div>

        <div class="usage-stat">
          <span class="label">Remaining:</span>
          <span class="value">${data.remainingGB.toFixed(2)} GB</span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>

        <div class="usage-stat">
          <span class="label">Usage %:</span>
          <span class="value">${usagePercentage}%</span>
        </div>

        <div class="usage-stat">
          <span class="label">Plan:</span>
          <span>${data.planName}</span>
        </div>

        <div class="usage-stat">
          <span class="label">Expires:</span>
          <span>${new Date(data.expirationDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div class="usage-card">
        <h3>📊 Recommendations</h3>
        ${
          data.status === 'critical'
            ? '<p>⚠️ Your data usage is critical. Consider reducing usage or purchasing additional data to avoid slowdowns.</p>'
            : data.status === 'warning'
              ? '<p>Monitor your usage closely. You may want to reduce data consumption to ensure coverage for the rest of the month.</p>'
              : '<p>Your data usage is healthy. Keep monitor ing your usage to stay within plan limits.</p>'
        }
      </div>
    </div>

    <div class="footer">
      <p>Report generated at: ${new Date(data.lastUpdated).toLocaleString()}</p>
      <p>This is an automated report from Tel Cel Data Monitor</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private async sendWithRetry(transporter: any, mailOptions: any, attempt = 1): Promise<void> {
    try {
      logger.info(`Sending email (attempt ${attempt}/${MAX_RETRIES})`);
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully');
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        logger.warn(
          { error: error instanceof Error ? error.message : String(error), attempt },
          'Email send failed, retrying...'
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY * attempt));
        return this.sendWithRetry(transporter, mailOptions, attempt + 1);
      } else {
        throw error;
      }
    }
  }

  async sendDailyReport(data: TelcelUsageData): Promise<void> {
    try {
      const transporter = await this.createTransporter();
      const htmlContent = this.formatEmailBody(data);

      const mailOptions = {
        from: this.config.senderEmail,
        to: this.config.recipientEmail,
        subject: `📱 Daily Data Usage Report - ${data.percentageUsed}% Used (${data.usedGB.toFixed(2)}/${data.totalGB} GB)`,
        html: htmlContent,
        text: `Your Tel Cel data usage: ${data.usedGB.toFixed(2)}/${data.totalGB} GB (${data.percentageUsed}% used)`,
      };

      await this.sendWithRetry(transporter, mailOptions);
    } catch (error) {
      throw new ApplicationError(500, 'Failed to send daily report email', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export async function sendUsageReport(
  usageData: TelcelUsageData,
  senderEmail: string,
  recipientEmail: string,
  appPassword: string
): Promise<void> {
  const config: EmailConfig = {
    senderEmail,
    recipientEmail,
    appPassword,
  };

  const sender = new GmailSender(config);
  await sender.sendDailyReport(usageData);
}
