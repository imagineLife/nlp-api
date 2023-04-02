import { Router } from 'express';
import { stateObj } from './../../../state.js';
async function getSpeeches(req, res) {
  return res.status(200).json({ get: 'speeches' });
}

async function postASpeech(req, res) {
  // sanity checking
  const {
    body: { author, text, date },
  } = req;
  if (!author || !text || !date) {
    return res.status(422).json({ Error: 'missing required params' });
  }

  try {
    const { insertedId } = await stateObj.Collections.Speeches.createOne({ author, text, date });
    return res.set('Location', `/speeches/${insertedId}`).status(200).end();
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
}
const speechesRouter = Router();
speechesRouter.get('/', getSpeeches).post('/', postASpeech);
export default speechesRouter;
