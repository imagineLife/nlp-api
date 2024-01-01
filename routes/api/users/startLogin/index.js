import jwt from 'jsonwebtoken';
import { get } from '../../../../state.js';
async function startLogin(req, res) {
  let foundUser = await get('Users').readOne({ _id: req.body.email });

  //
  // MOCK "success" even on bad email
  //
  if (foundUser === null) {
    res.status(200).end();
    console.log(`Bad email login attempt with ${req.body.email}`);
    return;
  }

  res.locals.jwt.startedLogin = {
    email: req.body.email,
    pw: foundUser.password,
  };

  const resignedJwt = jwt.sign(res.locals.jwt, process.env.SERVER_SESSION_SECRET);
  res.set('authorization', resignedJwt).status(200).end();
  return;
}

export default startLogin;
