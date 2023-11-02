import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

function runNamedAnalyticsHandler(req, res) {
  return res.status(200).json({ test: 'here' });
}

const allowedAnalytics = {
  bigrams: true,
};
function onlyAllowedAnalytic(req, res, next) {
  if (!allowedAnalytics[req.params.analyticName]) {
    res.status(422).json({ Error: 'Bad Analytic name' });
    return;
  } else {
    next();
  }
}

speechAnalyticsRouter.get(
  '/:analyticName/segmented/run',
  onlyAllowedAnalytic,
  runNamedAnalyticsHandler
);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
