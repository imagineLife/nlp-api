import express from 'express';
// import getHandler from './get.js';
import sentimentHandler from './sentiment/index.js'
const nlpExpressRouter = express.Router();

const nlpRoutes = [
  {
    path: '/sentiment',
    handler: sentimentHandler,
  },
  /*
  ,
  {
    path: '/',
    handler: getHandler,
  }
  */
];

nlpRoutes.forEach(({ path, handler }) => nlpExpressRouter.use(path, handler));

export default nlpExpressRouter;
