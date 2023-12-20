import { Router } from 'express';
import { Themes } from './../../../state.js';

const themesRouter = Router();

async function getThemes(req, res) {
  const themes = await Themes().collection.find({});
  const arrayThemes = await themes.toArray();
  return res.status(200).json(arrayThemes);
}

themesRouter.get('/', getThemes);
export default themesRouter;
