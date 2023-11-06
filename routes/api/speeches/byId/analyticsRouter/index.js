import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
import onlyAllowedAnalytic from '../../../../../middleware/onlyAllowedSegmentedAnalytics/index.js';
import runAnalyticSegmented from './runAnalyticSegmented.js';
import runAnalyticOnSpeech from './runAnalyticOnSpeech.js';
import onlyAllowedSegmentedAnalytic from '../../../../../middleware/onlyAllowedSegmentedAnalytics/index.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

speechAnalyticsRouter.get('/:analyticName/run', onlyAllowedAnalytic, runAnalyticOnSpeech);
speechAnalyticsRouter.get(
  '/:analyticName/segmented/run',
  onlyAllowedSegmentedAnalytic,
  runAnalyticSegmented
);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
