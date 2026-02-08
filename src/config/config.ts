export interface ApiConfig {
  baseUrl: string;
  subdomain?: string;
  timeout: number;
}

export interface DomainsConfig {
  main: string;
  admin: string;
}

export interface FeaturesConfig {
  enableAnalytics: boolean;
  enableConversionTracking: boolean;
}

export interface AppConfig {
  api: ApiConfig;
  domains: DomainsConfig;
  features: FeaturesConfig;
}

function getEnvVar(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvVarBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
}

function loadConfig(): AppConfig {
  const isDevelopment = import.meta.env.MODE !== 'production';

  return {
    api: {
      baseUrl: getEnvVar('VITE_API_BASE_URL', isDevelopment ? 'http://localhost:3001' : ''),
      subdomain: import.meta.env.VITE_API_SUBDOMAIN,
      timeout: getEnvVarNumber('VITE_API_TIMEOUT', 30000),
    },
    domains: {
      main: getEnvVar('VITE_DOMAIN_MAIN', isDevelopment ? 'localhost:5173' : 'example.com'),
      admin: getEnvVar('VITE_DOMAIN_ADMIN', isDevelopment ? 'localhost:5173' : 'admin.example.com'),
    },
    features: {
      enableAnalytics: getEnvVarBoolean('VITE_ENABLE_ANALYTICS', true),
      enableConversionTracking: getEnvVarBoolean('VITE_ENABLE_CONVERSION_TRACKING', true),
    },
  };
}

let cachedConfig: AppConfig | null = null;

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig();
  }
  return cachedConfig;
}

export default getConfig;
