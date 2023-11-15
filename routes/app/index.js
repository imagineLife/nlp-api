/*
  App Routes
  - setup "authn" for a frontend route 
  - meant to happen quickly on the frontend route initialization
  - 
  - 3 parts: 
    1. get from /init, returns an "appId"*
    2. get from /allow-access?id=<app-id-here>, returns success
    3. this "authenticates" the client via...a jwt?!...tbd

       

*/

import express from 'express';
const appRouter = express.Router();

// handlers
import getHandler from './get.js';
import allowAccessHandler from './allowAccess.js';

appRouter.get('/init', getHandler);
appRouter.get('/allow-access', allowAccessHandler);

export default appRouter;
