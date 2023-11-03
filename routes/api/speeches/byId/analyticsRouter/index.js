import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
import onlyAllowedAnalytic from '../../../../../middleware/onlyAllowedAnalytics/index.js';
import runNamedAnalyticsHandler from './runNamedAnalyticsHandler.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

speechAnalyticsRouter.get(
  '/:analyticName/segmented/run',
  onlyAllowedAnalytic,
  runNamedAnalyticsHandler
);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
