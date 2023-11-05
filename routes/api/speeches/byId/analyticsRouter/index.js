import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
import onlyAllowedAnalytic from '../../../../../middleware/onlyAllowedAnalytics/index.js';
import runAnalyticSegmented from './runAnalyticSegmented.js';
import runAnalyticOnSpeech from './runAnalyticOnSpeech.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

speechAnalyticsRouter.get('/:analyticName/run', onlyAllowedAnalytic, runAnalyticOnSpeech);
speechAnalyticsRouter.get(
  '/:analyticName/segmented/run',
  onlyAllowedAnalytic,
  runAnalyticSegmented
);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
