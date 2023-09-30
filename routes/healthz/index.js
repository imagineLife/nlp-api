import express from 'express';
import getHandler from './get.js';
import getLiveness from './liveness.js';
import getReadiness from './readiness.js';
const openApiRouter = express.Router();

const healthzRoutes = [
  {
    path: '/',
    handler: getHandler,
  },
  {
    path: '/liveness',
    handler: getLiveness,
  },
  {
    path: '/readiness',
    handler: getReadiness,
  },
];

healthzRoutes.forEach(({ path, handler }) => openApiRouter.get(path, handler));

export default openApiRouter;
