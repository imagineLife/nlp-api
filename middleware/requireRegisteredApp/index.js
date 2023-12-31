export default function requireRegisteredApp(req, res, next) {
  if (
    process?.env?.NODE_ENV == 'test' ||
    process?.env?.UNAUTHED_API === 'true' ||
    req?.params?.SpeechId === 'default'
  ) {
    console.log('SKIPPING requireRegisteredApp');

    next();
    return;
  } else {
    console.log('CHECKING requireRegisteredApp at', req.originalUrl);
    if (!req?.session?.appId) {
      return res.status(500).json({ Error: 'Access Not Allowed' });
    }
    return next();
  }
}
