import { Router } from 'express';
import byIdRouter from './byId/index.js'
import postASpeech from './post.js';

async function getSpeeches(req, res) {
  return res.status(200).json({ get: 'speeches' });
}

const speechesRouter = Router();
speechesRouter.get('/', getSpeeches).post('/', postASpeech);
speechesRouter.use('/:SpeechId', byIdRouter);
export default speechesRouter;
