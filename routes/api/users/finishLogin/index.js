import jwt from 'jsonwebtoken';
import { get } from '../../../../state.js';

async function finishLogin(req, res) {
  try {
    // unpack request jwt
    const clientJwt = jwt.decode(req?.body?.emailToken, process.env.SERVER_SESSION_SECRET);

    if (req.body.email !== clientJwt?.startedLogin?.email) {
      res.status(422).json({ Error: 'mismatched request details' });
      return;
    }

    let hashedPw = await get('Users').hashVal(req.body.password);
    if (hashedPw !== clientJwt.startedLogin.pw) {
      res.status(422).json({ Error: 'bad password' });
      return;
    }

    // TODO: FINISH THIS
    delete clientJwt.startedLogin;
    clientJwt.email = req.body.email;
    // jwt.authenticatedEmail = req.body.email;
    return res.status(200).send(jwt.sign(clientJwt, process.env.SERVER_SESSION_SECRET));
  } catch (error) {
    console.log('finishLogin error');
    console.log(error);
    return res.status(500).end();
  }
}

export default finishLogin;
