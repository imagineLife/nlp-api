import { Router } from 'express';
import nlpRouter from './nlp/index.js';
import speechesRouter from './speeches/index.js';

const routes = [
  { path: '/speeches', handler: speechesRouter },
  { path: '/nlp', handler: nlpRouter },
];

const apiRouter = Router();

routes.forEach(r => apiRouter.use(r.path, r.handler))

export default apiRouter;