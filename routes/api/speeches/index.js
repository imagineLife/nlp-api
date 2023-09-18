import { Router } from 'express';
import byIdRouter from './byId/index.js'
import postASpeech from './post.js';
import { speeches } from './../../../state.js';
import { failOnUnwatendFields } from './middleware.js'
async function getSpeeches(req, res) {
  let data = await speeches().find({}).toArray()
  return res.status(200).json(data);
}

const speechesRouter = Router();
speechesRouter.get('/', failOnUnwatendFields, getSpeeches).post('/', failOnUnwatendFields, postASpeech);
speechesRouter.use('/:SpeechId', failOnUnwatendFields, byIdRouter);
export default speechesRouter;
