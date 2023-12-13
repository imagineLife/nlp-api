import { Router } from 'express';
import { get } from './../../../state.js';

const themesRouter = Router();

async function getThemes(req, res) {
  const themes = await get('Themes').readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
  res.status(200).json(themes);
  return;
}

async function getThemesByUser(req, res) {
  const { authenticatedEmail } = req.session;
  const requestEmail = decodeURIComponent(req.params.email);
  if (requestEmail !== authenticatedEmail)
    return res.status(422).json({ Error: 'invalid email address' });
  let foundUser = await get('Users').themes({ email: authenticatedEmail });
  // const themes = await get('Themes').readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
  res.status(200).json(foundUser);
  return;
}

themesRouter.get('/:email', getThemesByUser);
themesRouter.get('/', getThemes);
export default themesRouter;
