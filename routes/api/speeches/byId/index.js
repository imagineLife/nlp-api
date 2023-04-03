import { Router } from 'express';
const speechByIdRouter = Router();

function getById(req, res) {
  return res.status(200).json({water: 'getById'})
}

function putById(req, res) {
  return res.status(200).json({ water: 'putById' });
}

speechByIdRouter.get('/', getById).put('/', putById);

export default speechByIdRouter;
