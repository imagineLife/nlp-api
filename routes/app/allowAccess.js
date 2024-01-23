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
    console.log('jwt decode error');
    console.log(error);
    return res.status(422).json({ Error: MISSING_DATA_ERR });
  }

  const { appId } = clientJwt;
  console.log('allowAccessHandler clientJwt');
  console.log(clientJwt);

  if (!stateObj[`${appId}`]) {
    console.log('NO token in state');

    const subjectSecret = 'nlp-api';
    const subjectHash = createHmac('sha256', subjectSecret).update(appId).digest('hex');
    const SAME_ISSUER = clientJwt.iss === process.env.JWT_ISSUER;
    const NOT_EXPIRED = clientJwt.exp >= new Date();
    const RIGHT_AUD = clientJwt.aud === 'laursen.tech/nlp';
    const RIGHT_SUB = clientJwt.sub === subjectHash;
    // check for token valid after server "refresh"
    if (SAME_ISSUER && NOT_EXPIRED && RIGHT_AUD && RIGHT_SUB) {
      let newExpDate = '10h';
      clientJwt.expiresIn = newExpDate;
      stateObj[`${appId}`] = newExpDate;
    } else {
      return res.status(422).json({ Error: NO_APP_REGISTERED_ERR });
    }
  }

  // check & update expiration date if possible...hmm...
  const savedAppDate = stateObj[`${appId}`];
  if (savedAppDate <= new Date()) {
    let a = new Date();
    a.setTime(a.getTime() + 10 * 60 * 60 * 1000);
    stateObj[`${appId}`] = a;
    clientJwt.expiresIn = '10h';
  }

  // HMM!
  // delete stateObj[`${appId}`];
  res.status(200).send(jwt.sign(clientJwt, process.env.SERVER_SESSION_SECRET));
  return;
}
