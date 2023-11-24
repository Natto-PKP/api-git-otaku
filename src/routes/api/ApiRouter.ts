import { Router } from 'express';
import { ApiLogRouter } from './logs/ApiLogRouter';

export const ApiRouter = Router();

ApiRouter.use('/logs', ApiLogRouter);
