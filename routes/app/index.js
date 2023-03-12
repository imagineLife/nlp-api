import express from 'express';
const appRouter = express.Router();
const nlpExpressRouter = express.Router();


// handlers
import getHandler from './get.js';
import allowAccessHandler from './allowAccess.js';

// const nlpRoutes = [
//   {
//     path: '/',
//     handler: getHandler,
//   },
// ];

// nlpRoutes.forEach(({ path, handler }) => nlpExpressRouter.use(path, handler));
appRouter.get('/init', getHandler)
appRouter.get('/allow-access', allowAccessHandler);

export default appRouter;
