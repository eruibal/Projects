export interface TelcelUsageData {
  totalGB: number;
  usedGB: number;
  remainingGB: number;
  percentageUsed: number;
  planName: string;
  expirationDate: string;
  lastUpdated: string;
  status: 'active' | 'warning' | 'critical';
}

export interface EmailConfig {
  senderEmail: string;
  recipientEmail: string;
  appPassword: string;
}

export interface ScraperConfig {
  username: string;
  password: string;
  headless: boolean;
  timeout: number;
  screenshotOnError: boolean;
}

export interface FunctionRequest {
  body?: string;
  query?: Record<string, string>;
}

export interface FunctionResponse {
  status: number;
  message: string;
  data?: unknown;
  error?: string;
}
