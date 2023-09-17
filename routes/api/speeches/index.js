import { Router } from 'express';
import byIdRouter from './byId/index.js'
import postASpeech from './post.js';
import { speeches } from './../../../state.js';

async function getSpeeches(req, res) {
  let data = await speeches().find({}).toArray()
  return res.status(200).json(data);
}

const speechesRouter = Router();
speechesRouter.get('/', getSpeeches).post('/', postASpeech);
speechesRouter.use('/:SpeechId', byIdRouter);
export default speechesRouter;
