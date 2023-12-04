import { Router } from 'express';
import { get } from './../../../state.js';

const themesRouter = Router();

async function getThemes(req, res) {
  const themes = await get('Themes').readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
  res.status(200).json(themes);
  return;
}

themesRouter.get('/', getThemes);
export default themesRouter;
