export default function onlyAllowedAnalytic(req, res, next) {
  const allowedAnalytics = {
    bigrams: true,
  };

  if (!allowedAnalytics[req.params.analyticName]) {
    res.status(422).json({ Error: 'Bad Analytic name' });
    return;
  } else {
    next();
  }
}
