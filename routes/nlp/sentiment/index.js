import express from 'express';
import postHandler from './post.js';
import excelPost from './excelPost.js';
import expectTextInBody from './expectTextInBody.js';

const sentimentRouter = express.Router();

sentimentRouter.post('/excel', expectTextInBody, excelPost);
sentimentRouter.post('/', expectTextInBody, postHandler);

export default sentimentRouter;
