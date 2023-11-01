import { Router } from 'express';
import { getById } from './get.js';
import getSpeechAnalyticsRouter from './analyticsRouter/index.js';

const speechByIdRouter = Router({ mergeParams: true });
speechByIdRouter.use('/analytics', getSpeechAnalyticsRouter);
speechByIdRouter.get('/', getById);

export default speechByIdRouter;
