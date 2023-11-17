export default function requireRegisteredApp(req, res, next) {
  console.log('----requireRegisteredApp----');
  console.log('req?.session');
  console.log(req?.session);

  if (
    process?.env?.NODE_ENV == 'test' ||
    process?.env?.UNAUTHED_API === 'true' ||
    req?.params?.SpeechId === 'default'
  ) {
    next();
    return;
  } else {
    if (!req?.session?.appId) {
      return res.status(500).json({ Error: 'Access Not Allowed' });
    }
    return next();
  }
}
