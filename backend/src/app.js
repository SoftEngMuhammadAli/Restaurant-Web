import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/index.js';
import { apiLimiter } from './middlewares/rateLimit.middleware.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { swaggerSpec } from './docs/swagger.js';
import { apiRouter } from './routes/index.js';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLimiter);

  app.get('/health', (_req, res) => res.json({ ok: true, service: 'restaurant-saas-api' }));
  app.get('/api/docs.json', (_req, res) => res.json(swaggerSpec));
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Restaurant SaaS API Docs',
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );
  app.use('/api/v1', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};
