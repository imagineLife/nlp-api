import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

// function getSpeechAnalytics(req, res) {
//   res.status(200).json({ horse: 'dog' });
//   return;
// }
// speechAnalyticsRouter.get('/analytics', getAnalytics);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
