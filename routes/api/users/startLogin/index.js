import { get } from '../../../../state.js';
async function startLogin(req, res) {
  try {
    let foundUser = await get('Users').readOne({ _id: req.body.email });
    if (foundUser === null) {
      // MOCK "success" even on bad email
      res.status(200).end();
      console.log(`Bad email login attempt with ${req.body.email}`);
      return;
    }

    // store user data in session
    req.session.startedLogin = {
      email: req.body.email,
      pw: foundUser.password,
    };
    res.status(200).end();
    return;
  } catch (error) {
    throw new Error(error);
  }
}

export default startLogin;
