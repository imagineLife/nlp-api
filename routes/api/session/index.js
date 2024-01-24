import jwt from 'jsonwebtoken';
import { Router } from 'express';

const SessionRouter = new Router();

async function getUserAuthFromSession(req, res) {
  try {
    const clientJwt = jwt.decode(
      req?.headers?.authorization.split(' ')[1],
      process.env.SERVER_SESSION_SECRET
    );
    // console.log('getUserAuthFromSession clientJwt');
    // console.log(clientJwt);
    let { email } = clientJwt;
    if (email) {
      return res.status(200).json({ email });
    }
    console.log('NO JWT EMAIL');

    return res.status(422).end();
  } catch (error) {
    console.log('getUserSession error:');
    console.log(error);
    return res.status(422).end();
  }
}
SessionRouter.get('/', getUserAuthFromSession);
export default SessionRouter;
