import express from 'express';
import getHandler from './get.js';
const openApiRouter = express.Router();

const healthzRoutes = [
  {
    path: '/',
    handler: getHandler,
  }
];

healthzRoutes.forEach(({ path, handler }) => openApiRouter.get(path, handler));

export default openApiRouter;
