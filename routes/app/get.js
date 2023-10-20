import { randomUUID } from "crypto";
import assureAllowed from "./assureAllowed.js";
import { stateObj } from "./../../state.js";

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

export default function getHandler(req, res) {
  const { hostname, query } = req;

  // var ip = req?.socket?.remoteAddress || req.headers['x-forwarded-for'];

  assureAllowed({
    hostname,
    query,
    allowedHost: process?.env?.ALLOWED_HOST,
    allowedQuery: { id: process?.env?.ALLOWED_QUERY },
  });

  const { appId, expDate } = createAppDetails(APP_EXP_MINUTES);

  stateObj[`${appId}`] = expDate;

  return res.status(200).json({ id: appId });
}
