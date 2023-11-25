import Express, { Router } from 'express';
import cors from 'cors';
import cookies from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from './routes';
import { swaggerSetup } from './swagger';

import errorHandler from './errorHandler';
import { NotFoundError } from '../errors/BasicError';

export const router = Router();

// Middlewares
router.use(cors());
router.use(Express.json());
router.use(Express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') router.use(morgan('tiny'));
router.use(cookies(process.env.SIGNED_COOKIE_SECRET));
router.use(Express.static('public'));

router.use('/api/docs', swaggerUi.serve, swaggerSetup);

RegisterRoutes(router);

// 404 handler
router.use(() => {
  throw NotFoundError('endpoint not found', { logit: false });
});

// Error handler
router.use(errorHandler);
