import jwt from 'jsonwebtoken';
import { Router } from 'express';

const SessionRouter = new Router();

function getUserAuthFromSession(req, res) {
  try {
    const clientJwt = jwt.decode(
      req?.headers?.authorization.split(' ')[1],
      process.env.SERVER_SESSION_SECRET
    );
    console.log('getUserAuthFromSession clientJwt');
    console.log(clientJwt);
    let { sub } = clientJwt;
    if (req?.session?.authenticatedEmail) {
      return res.status(200).json({ email: req.session.authenticatedEmail });
    }
    return res.status(422).end();
  } catch (error) {
    return res.status(422).end();
  }
}
SessionRouter.get('/', getUserAuthFromSession);
export default SessionRouter;
