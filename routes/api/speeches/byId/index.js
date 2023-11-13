import { Router } from 'express';
import { getById } from './get.js';
import getSpeechAnalyticsRouter from './analyticsRouter/index.js';

function getDefaultOrNext(req, res, next) {
  if (req.params.SpeechId === 'default') {
    res.status(200).json({ speech: 'default goes here!' });
    return;
  }
  next();
}
const speechByIdRouter = Router({ mergeParams: true });
speechByIdRouter.use('/analytics', getSpeechAnalyticsRouter);
speechByIdRouter.get('/', getDefaultOrNext, getById);

export default speechByIdRouter;
