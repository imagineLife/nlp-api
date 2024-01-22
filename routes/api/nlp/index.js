import express from 'express';
// import getHandler from './get.js';
import sentimentHandler from './sentiment/index.js';
import themesHandler from './themes/index.js';
const nlpExpressRouter = express.Router();

const nlpRoutes = [
  {
    path: '/sentiment',
    handler: sentimentHandler,
  },
  {
    path: '/themes',
    handler: themesHandler,
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
