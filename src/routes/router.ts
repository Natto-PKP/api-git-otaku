import Express, { Router } from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';

import errorHandler from './errorHandler';
import { BasicError } from '../errors/BasicError';

import { AuthRouter } from './auth/AuthRouter';
import { UserRouter } from './users/UserRouter';
import { ApiRouter } from './api/ApiRouter';

export const router = Router();

// Middlewares
router.use(cors());
router.use(Express.json());
router.use(Express.urlencoded({ extended: true }));
router.use(cookies(process.env.SIGNED_COOKIE_SECRET));

// Routes
router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/api', ApiRouter);

// 404 handler
router.use(() => {
  throw new BasicError({ code: 'ENDPOINT_NOT_FOUND', status: 404 }, { logit: false });
});

// Error handler
router.use(errorHandler);
