import { Router } from "express";

async function getSpeeches(req,res) {
  return res.status(200).json({get: 'speeches'})
}

function postASpeech(req, res) { 
  return res.status(200).json({posted: 'demo'})
}
const speechesRouter = Router()
speechesRouter.get('/', getSpeeches).post('/', postASpeech)
export default speechesRouter;