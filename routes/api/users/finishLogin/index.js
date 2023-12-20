import { get } from '../../../../state.js';

async function finishLogin(req, res) {
  if (!req?.session?.startedLogin) {
    res.status(422).json({ Error: 'try logging in again' });
    return;
  }
  if (req.body.email !== req.session.startedLogin.email) {
    res.status(422).json({ Error: 'bad email' });
    return;
  }

  let hashedPw = await get('Users').hashVal(req.body.password);

  if (hashedPw !== req.session.startedLogin.pw) {
    res.status(422).json({ Error: 'bad password' });
    return;
  }
  delete req.session.startedLogin;
  req.session.authenticatedEmail = req.body.email;
  res.status(200).end();
  return;
}

export default finishLogin;
