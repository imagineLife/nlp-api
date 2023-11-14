import { Router } from 'express';
// import byIdRouter from './byId/index.js';
import { get } from './../../../state.js';
import registerEmailHandler from './register.js';

async function getUsers(req, res) {
  try {
    let data = await get('Users').readMany();
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).send('API ERROR');
  }
}

const usersRouter = Router();

// usersRouter.use('/:userId', failOnUnwatendFields, byIdRouter);

function requireEmail(req, res, next) {
  // sanity checking
  const { email, password } = req.body;
  if ((!email && !password) || (!email && password)) {
    return res.status(422).json({ Error: 'not allowed' });
  }
  next();
}

async function startLogin(req, res, next) {
  try {
    let foundUser = await get('Users').readOne({ _id: req.body.email });

    // store user data in session
    req.session.startedLogin = {
      email: req.body.email,
      pw: foundUser.password,
    };
    console.log('req?.session');
    console.log(req?.session);

    res.status(200).end();
    return;
  } catch (error) {
    console.log('error');
    console.log(error);

    res.status(500);
    return;
  }
}

async function finishLogin(req, res, next) {
  if (!req?.session?.startedLogin) {
    res.status(422).json({ Error: 'try logging in again' });
    return;
  }
  console.log('req.session.startedLogin');
  console.log(req.session.startedLogin);
  if (req.body.email !== req.session.startedLogin.email) {
    res.status(422).json({ Error: 'bad email' });
    return;
  }

  let hashedPw = await get('Users').hashVal(req.body.password);
  if (hashedPw !== req.session.startedLogin.password) {
    res.status(422).json({ Error: 'bad password' });
    return;
  }
  delete req.session.startedLogin;
  req.session.authenticatedEmail = req.body.email;
  res.status(200).end();
  return;
}
usersRouter
  // failOnUnwatendFields on both routes
  .post('/register', requireEmail, registerEmailHandler)
  .post('/email', requireEmail, startLogin)
  .post('/pw', requireEmail, finishLogin)
  .get('/', getUsers);
export default usersRouter;
