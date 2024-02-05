import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { logger } from '../../../lib/logger.js';

const SessionRouter = new Router();

async function getUserAuthFromSession(req, res) {
  try {
    const clientJwt = jwt.verify(
      req?.headers?.authorization.split(' ')[1],
      process.env.SERVER_SESSION_SECRET
    );
    // logger.info('getUserAuthFromSession clientJwt');
    // logger.info(clientJwt);
    let { email } = clientJwt;
    if (email) {
      return res.status(200).json({ email });
    }
    logger.debug('NO JWT EMAIL');

    return res.status(422).end();
  } catch (error) {
    logger.error('getUserSession error:');
    logger.error(error);
    return res.status(422).end();
  }
}

function removeEmailFromToken(req, res) {
  try {
    const {
      body: { jwt: token },
    } = req;
    const decoded = jwt.verify(token, process.env.SERVER_SESSION_SECRET);
    let newExpDate = '10h';
    decoded.expiresIn = newExpDate;
    delete decoded.email;
    return res.status(200).json({ jwt: jwt.sign(decoded, process.env.SERVER_SESSION_SECRET) });
  } catch (error) {
    logger.error('delete token error');
    logger.error(error?.message);
    return res.status(500).end();
  }
}

SessionRouter.get('/', getUserAuthFromSession).delete('/', removeEmailFromToken);
export default SessionRouter;
