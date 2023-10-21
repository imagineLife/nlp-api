import { Router } from 'express';
// import byIdRouter from './byId/index.js';
import postAUser from './post.js';
import { get } from './../../../state.js';
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

function requireUserFields({ body }, res, next) {
  // sanity checking
  const { email, firstName, lastName, password } = body;
  if (!email || !firstName || !lastName || !password) {
    return res.status(422).json({ Error: 'missing required params' });
  }
  next();
}

usersRouter
  // failOnUnwatendFields on both routes
  .get('/', getUsers)
  .post('/', requireUserFields, postAUser);
export default usersRouter;
