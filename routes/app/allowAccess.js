import { createHmac } from 'crypto';
import { stateObj } from './../../state.js';
import jwt from 'jsonwebtoken';
export const MISSING_DATA_ERR = 'missing required data to allow access';
export const NO_APP_REGISTERED_ERR =
  'No App Registration stored for this instance, try starting over!';
export const APP_REG_EXP_ERR = 'App Registration Expired, try starting over!';
export default function allowAccessHandler(req, res) {
  /*
    Error Handling
    - require req.query.id
    - req.query.id 
      - SHOULD be in "state"
      - date SHOULD NOT be before now
  */
  let clientJwt;
  try {
    clientJwt = req?.headers['authorization']?.split(' ')[1];
    const decoded = jwt.verify(clientJwt, process.env.SERVER_SESSION_SECRET);
    clientJwt = decoded;
  } catch (error) {
    return res.status(422).json({ Error: MISSING_DATA_ERR });
  }

  const { appId } = clientJwt;

  if (!stateObj[`${appId}`]) {
    const subjectSecret = 'nlp-api';
    const subjectHash = createHmac('sha256', subjectSecret).update(appId).digest('hex');

    // check for token valid after server "refresh"
    if (
      clientJwt.iss === process.env.JWT_ISSUER &&
      clientJwt.exp <= new Date() &&
      clientJwt.aud === 'laursen.tech/nlp' &&
      clientJwt.sub === subjectHash
    ) {
      let now = new Date();
      let newExpDate = now.setMinutes(now.getMinutes() + 1440);
      clientJwt.expiresIn = newExpDate;
      stateObj[`${appId}`] = newExpDate;
    } else {
      return res.status(422).json({ Error: NO_APP_REGISTERED_ERR });
    }
  }

  const savedAppDate = stateObj[`${appId}`];
  if (savedAppDate <= new Date()) {
    delete stateObj[`${appId}`];
    return res.status(422).json({ Error: APP_REG_EXP_ERR });
  }

  // HMM!
  // delete stateObj[`${appId}`];
  res.status(200).send(jwt.sign(clientJwt, process.env.SERVER_SESSION_SECRET));
  return;
}
