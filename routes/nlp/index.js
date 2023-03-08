import express from 'express';
import getHandler from './get.js';
const nlpExpressRouter = express.Router();

const nlpRoutes = [
  {
    path: '/',
    handler: getHandler,
  }
];

nlpRoutes.forEach(({ path, handler }) => nlpExpressRouter.use(path, handler));

export default nlpExpressRouter;
