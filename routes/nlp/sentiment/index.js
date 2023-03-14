import express from 'express';
import postHandler from './post.js';
const sentimentRouter = express.Router();

function excelPost(req, res) {
  return res.send('excel hurr')
}
sentimentRouter.post('/excel', excelPost);
sentimentRouter.post('/', postHandler);

export default sentimentRouter;
