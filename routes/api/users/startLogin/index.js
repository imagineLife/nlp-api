import { get } from '../../../../state.js';
async function startLogin(req, res) {
  console.log('START login');
  console.log('req?.session');
  console.log(req?.session);

  let foundUser = await get('Users').readOne({ _id: req.body.email });

  //
  // MOCK "success" even on bad email
  //
  if (foundUser === null) {
    res.status(200).end();
    console.log(`Bad email login attempt with ${req.body.email}`);
    return;
  }

  // store user data in session
  req.session.startedLogin = {
    email: req.body.email,
    pw: foundUser.password,
  };
  console.log('req?.session');
  console.log(req?.session);

  req.session;
  res.status(200).end();
  return;
}

export default startLogin;
