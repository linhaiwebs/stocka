export interface ServerConfig {
  port: number;
  host: string;
  subdomain?: string;
}

export interface FrontendConfig {
  mainDomain: string;
  devUrl: string;
}

export interface DatabaseConfig {
  path: string;
  backupPath: string;
}

export interface SecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
}

export interface CorsConfig {
  adminOrigins: string[];
  templateOrigins: string[];
}

export interface RateLimitingConfig {
  windowMs: number;
  templateMax: number;
  adminMax: number;
  publicMax: number;
}

export interface AppConfig {
  server: ServerConfig;
  frontend: FrontendConfig;
  database: DatabaseConfig;
  security: SecurityConfig;
  cors: CorsConfig;
  rateLimiting: RateLimitingConfig;
}

function getEnvVar(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

function getEnvVarNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvVarArray(key: string, defaultValue: string[]): string[] {
  const value = process.env[key];
  return value ? value.split(',').map(s => s.trim()) : defaultValue;
}

function validateConfig(config: AppConfig): void {
  if (!config.security.jwtSecret || config.security.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.NODE_ENV === 'production' && config.security.jwtSecret === 'change-this-secret-in-production-use-long-random-string') {
    throw new Error('JWT_SECRET must be changed in production');
  }
}

function loadConfig(): AppConfig {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  const config: AppConfig = {
    server: {
      port: getEnvVarNumber('PORT', 3001),
      host: getEnvVar('HOST', 'localhost'),
      subdomain: process.env.SERVER_SUBDOMAIN,
    },
    frontend: {
      mainDomain: getEnvVar('FRONTEND_MAIN_DOMAIN', 'example.com'),
      devUrl: getEnvVar('FRONTEND_DEV_URL', 'http://localhost:5173'),
    },
    database: {
      path: getEnvVar('DATABASE_PATH', './data/landing_pages.db'),
      backupPath: getEnvVar('DATABASE_BACKUP_PATH', './backups'),
    },
    security: {
      jwtSecret: getEnvVar('JWT_SECRET', 'change-this-secret-in-production-use-long-random-string'),
      jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '8h'),
      bcryptRounds: getEnvVarNumber('BCRYPT_ROUNDS', 10),
    },
    cors: {
      adminOrigins: getEnvVarArray(
        'CORS_ADMIN_ORIGINS',
        isDevelopment
          ? ['http://localhost:5173', 'http://localhost:5174']
          : ['https://admin.example.com']
      ),
      templateOrigins: getEnvVarArray(
        'CORS_TEMPLATE_ORIGINS',
        isDevelopment
          ? ['http://localhost:5173']
          : ['https://example.com']
      ),
    },
    rateLimiting: {
      windowMs: getEnvVarNumber('RATE_LIMIT_WINDOW_MS', 60000),
      templateMax: getEnvVarNumber('RATE_LIMIT_TEMPLATE_MAX', 100),
      adminMax: getEnvVarNumber('RATE_LIMIT_ADMIN_MAX', 1000),
      publicMax: getEnvVarNumber('RATE_LIMIT_PUBLIC_MAX', 500),
    },
  };

  validateConfig(config);

  return config;
}

export const config = loadConfig();

export default config;
