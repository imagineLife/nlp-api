import { Router } from "express";

function getSpeeches(req,res) {
  return res.status(200).json({get: 'speeches'})
}
const speechesRouter = Router()
speechesRouter.get('/', getSpeeches)
export default speechesRouter;