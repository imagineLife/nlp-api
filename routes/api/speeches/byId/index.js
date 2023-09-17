import { Router } from 'express';
import { stateObj } from '../../../../state.js';

const speechByIdRouter = Router({ mergeParams: true });

async function getById(req, res) {
  // sanity checking
  if (!req?.params?.SpeechId) res.status(422).json({ Error: 'malformed request' });
  
  try {
    const foundObj = await stateObj.Collections.Speeches.readById(req.params.SpeechId);
    
    return res.status(200).json(foundObj);
  } catch (error) {
    res.status(500).json({ Good: "Lord" })
    console.log(error.message)
    
  }
}

function putById(req, res) {
  return res.status(200).json({ put: 'putById' });
}

speechByIdRouter.get('/', getById).put('/', putById);

export default speechByIdRouter;
