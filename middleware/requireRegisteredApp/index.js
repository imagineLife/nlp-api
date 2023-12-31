import jwt from 'jsonwebtoken';

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
    let { headers } = req;
    const clientJwt = headers?.authorization.split(' ')[1];
    if (!clientJwt) return res.status(500).json({ Error: 'Access Not Allowed' });

    const decoded = jwt.verify(clientJwt, process.env.SERVER_SESSION_SECRET);
    console.log('decoded');
    console.log(decoded);

    if (!decoded?.appId) {
      return res.status(500).json({ Error: 'Access Not Allowed' });
    }
    return next();
  }
}
