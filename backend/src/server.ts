import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config.js';
import { initDatabaseWithSeeding, getDatabase } from './config/database.js';
import { adminRateLimiter, templateRateLimiter, publicRateLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.routes.js';
import templateRoutes from './routes/template.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import trafficRoutes from './routes/traffic.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import siteSettingsRoutes from './routes/site-settings.routes.js';

async function startServer() {
  await initDatabaseWithSeeding();

  const app = express();
  const PORT = config.server.port;

  app.set('trust proxy', true);

  app.use(helmet());

  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [...config.cors.adminOrigins, ...config.cors.templateOrigins];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    const db = getDatabase();
    const templateCount = db.prepare('SELECT COUNT(*) as count FROM templates').get() as { count: number };
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      templates: templateCount.count
    });
  });

  app.use('/api/auth', publicRateLimiter, authRoutes);
  app.use('/api/admin/templates', adminRateLimiter, templateRoutes);
  app.use('/api/templates', templateRateLimiter, templateRoutes);
  app.use('/api/admin/analytics', adminRateLimiter, analyticsRoutes);
  app.use('/api/analytics', templateRateLimiter, analyticsRoutes);
  app.use('/api/admin/traffic', adminRateLimiter, trafficRoutes);
  app.use('/api/traffic', publicRateLimiter, trafficRoutes);
  app.use('/api/admin/dashboard', adminRateLimiter, dashboardRoutes);
  app.use('/api/admin/site-settings', adminRateLimiter, siteSettingsRoutes);
  app.use('/api/site-settings', publicRateLimiter, siteSettingsRoutes);

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || 'Internal server error'
    });
  });

  app.listen(PORT, config.server.host, () => {
    console.log(`\n🚀 Backend API server running on ${config.server.host}:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
