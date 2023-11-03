export default function requireRegisteredApp(req, res, next) {
  if (process?.env?.NODE_ENV == 'test') {
    next();
    return;
  } else {
    if (!req?.session?.appId) {
      return res.status(500).json({ Error: 'Access Not Allowed' });
    }
    return next();
  }
}
