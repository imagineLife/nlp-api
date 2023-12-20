import { Router } from 'express';
// import byIdRouter from './byId/index.js';
import { get } from './../../../state.js';
import registerEmailHandler from './register.js';
import startLogin from './startLogin/index.js';
import finishLogin from './finishLogin/index.js';
import { userByIdRouter } from './byId/index.js';

async function getUsers(req, res) {
  let data = await get('Users').readMany();
  return res.status(200).json(data);
}

const usersRouter = Router();

function requireEmail(req, res, next) {
  // sanity checking
  const { email, password } = req.body;
  if ((!email && !password) || (!email && password)) {
    return res.status(422).json({ Error: 'not allowed' });
  }
  next();
}

usersRouter
  .post('/register', requireEmail, registerEmailHandler)
  .post('/email', requireEmail, startLogin)
  .post('/pw', requireEmail, finishLogin)
  .get('/', getUsers)
  .use('/:email', userByIdRouter);
export default usersRouter;
