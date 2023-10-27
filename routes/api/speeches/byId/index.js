import { Router } from 'express';
import { getById } from './get.js';
import { getAnalytics } from './getAnalytics.js';
const speechByIdRouter = Router({ mergeParams: true });
speechByIdRouter.get('/analytics', getAnalytics);
speechByIdRouter.get('/', getById);

export default speechByIdRouter;
