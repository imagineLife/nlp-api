export default function requireRegisteredApp(req, res, next) {
  console.log('process?.env?.UNAUTHED_API');
  console.log(process?.env?.UNAUTHED_API);

  if (process?.env?.NODE_ENV == 'test' || process?.env?.UNAUTHED_API === 'true') {
    next();
    return;
  } else {
    if (!req?.session?.appId) {
      return res.status(500).json({ Error: 'Access Not Allowed' });
    }
    return next();
  }
}
