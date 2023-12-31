import { randomUUID } from 'crypto';
import assureAllowed from './assureAllowed.js';
import { stateObj } from './../../state.js';
import jwt from 'jsonwebtoken';
import { createHmac } from 'crypto';
const APP_EXP_MINUTES = 2;

function addMinutes(date, minutes) {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

function createAppDetails(expMinutes) {
  const appId = randomUUID();
  const rightNow = new Date();
  const expDate = addMinutes(rightNow, expMinutes);
  return { appId, expDate };
}

export function referrerOrHost(referrer, host) {
  if (referrer && host !== 'localhost') {
    return referrer.split('//')[1];
  }
  return host;
}

function createAppJwt(appId) {
  const subjectSecret = 'nlp-api';
  const subjectHash = createHmac('sha256', subjectSecret).update(appId).digest('hex');
  return jwt.sign(
    {
      appId,
    },
    process.env.SERVER_SESSION_SECRET,
    {
      expiresIn: '10h',
      issuer: process.env.JWT_ISSUER,
      subject: subjectHash,
      audience: 'laursen.tech/nlp',
    }
  );
}

export default function getHandler(req, res) {
  const { query, headers } = req;

  let reqHost = headers.host;
  reqHost = reqHost.includes(':') ? reqHost.split(':')[0] : reqHost;

  // var ip = req?.socket?.remoteAddress || req.headers['x-forwarded-for'];
  assureAllowed({
    hostname: referrerOrHost(headers.referer, reqHost),
    query,
    allowedHost: process?.env?.ALLOWED_HOST,
    allowedQuery: { id: process?.env?.ALLOWED_QUERY },
  });

  const { appId, expDate } = createAppDetails(APP_EXP_MINUTES);

  // store in state
  stateObj[`${appId}`] = expDate;

  return res.status(200).json({
    appToken: createAppJwt(appId),
  });
}
