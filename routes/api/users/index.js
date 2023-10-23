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
    return res.status(422).json({ Error: 'cannot register' });
  }
  next();
}

usersRouter
  // failOnUnwatendFields on both routes
  .post('/register', requireEmail, registerEmailHandler)
  .get('/', getUsers);
export default usersRouter;
