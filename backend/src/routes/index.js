import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { domainRouter } from './domain.routes.js';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/', domainRouter);
