import { Router } from 'express';
import nlpRouter from './nlp/index.js';
import speechesRouter from './speeches/index.js';
import themesRouter from './themes/index.js';
import usersRouter from './users/index.js';
import sessionRouter from './session/index.js';
// import requireRegisteredApp from '../../middleware/requireRegisteredApp/index.js';

const routes = [
  { path: '/speeches', handler: speechesRouter },
  { path: '/themes', handler: themesRouter },
  { path: '/nlp', handler: nlpRouter },
  { path: '/users', handler: usersRouter },
  { path: '/session', handler: sessionRouter },
];

const apiRouter = Router();

// requireRegisteredApp
routes.forEach(({ path, handler }) => apiRouter.use(path, [handler]));

export default apiRouter;
