import { randomUUID } from 'crypto';
import assureAllowed from './assureAllowed.js';
import { stateObj } from './../../state.js';

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
  console.log('---referrerOrHost---');

  console.log('referrer');
  console.log(referrer);
  console.log('host');
  console.log(host);

  if (referrer) {
    return referrer.split('//')[1];
  }
  return host;
}
export default function getHandler(req, res) {
  const { query, headers } = req;

  let reqHost = headers.host;
  reqHost = reqHost.includes(':') ? reqHost.split(':')[0] : reqHost;

  console.log('----before assureAllowed');
  console.log('headers');
  console.log(headers);

  console.log({
    referrer: headers.referrer,
    reqHost,
  });

  // var ip = req?.socket?.remoteAddress || req.headers['x-forwarded-for'];
  assureAllowed({
    hostname: referrerOrHost(headers.referrer, reqHost),
    query,
    allowedHost: process?.env?.ALLOWED_HOST,
    allowedQuery: { id: process?.env?.ALLOWED_QUERY },
  });

  const { appId, expDate } = createAppDetails(APP_EXP_MINUTES);

  // store in state
  stateObj[`${appId}`] = expDate;
  // stateObj[`${appId}`] = {
  //   registrationExpires: expDate,
  // };

  return res.status(200).json({ id: appId });
}
