import jwt from 'jsonwebtoken';
import { Router } from 'express';
// import byIdRouter from './byId/index.js';
import { get } from './../../../state.js';
import registerEmailHandler from './register.js';
import startLogin from './startLogin/index.js';
import finishLogin from './finishLogin/index.js';
import { userByIdRouter } from './byId/index.js';
function expectaAndUnpackJwt(req, res, next) {
  try {
    const clientJwt = req.headers.authorization.split(' ')[1];
    res.locals.jwt = jwt.decode(clientJwt, process.env.SERVER_SESSION_SECRET);
    next();
  } catch (error) {
    return res.status(500).json({ Error: 'unauthenticated' });
  }
}

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
  .post('/email', requireEmail, expectaAndUnpackJwt, startLogin)
  .post('/pw', requireEmail, expectaAndUnpackJwt, finishLogin)
  .get('/', getUsers)
  .use('/:email', userByIdRouter);
export default usersRouter;
