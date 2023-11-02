import { Router } from 'express';
import { getAnalytics } from './getAnalytics.js';
const speechAnalyticsRouter = Router({ mergeParams: true });

// function getSpeechAnalytics(req, res) {
//   res.status(200).json({ horse: 'dog' });
//   return;
// }

function runNamedAnalytics(req, res) {
  console.log({
    speechId: req?.params?.SpeechId,
    analyticName: req?.params?.analyticName,
  });

  return res.status(200).json({ test: 'here' });
}
speechAnalyticsRouter.get('/:analyticName/segmented/run', runNamedAnalytics);
speechAnalyticsRouter.get('/', getAnalytics);

export default speechAnalyticsRouter;
