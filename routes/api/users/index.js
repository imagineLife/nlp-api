import { Router } from 'express';
// import byIdRouter from './byId/index.js';
import { get } from './../../../state.js';
import registerEmailHandler from './register.js';
import startLogin from './startLogin/index.js';
import finishLogin from './finishLogin/index.js';

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

function getUserAuthStatus(req, res) {
  console.log('req?.session');
  console.log(req?.session);

  return res.status(200).json({ authed: 'true' });
}
usersRouter
  .post('/register', requireEmail, registerEmailHandler)
  .post('/email', requireEmail, startLogin)
  .post('/pw', requireEmail, finishLogin)
  .get('/auth', getUserAuthStatus)
  .get('/', getUsers);
export default usersRouter;
