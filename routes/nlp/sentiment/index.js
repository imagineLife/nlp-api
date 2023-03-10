import express from 'express';
import postHandler from './post.js';
const sentimentRouter = express.Router();

sentimentRouter.post('/', postHandler);

export default sentimentRouter;
