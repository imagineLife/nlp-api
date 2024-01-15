import { Router } from 'express';
import { Users } from '../../../../state.js';
import { userThemeDetailRouter } from './themeDetails.js';

function getUserAuthStatus(req, res) {
  if (req?.params?.email === req?.session?.authenticatedEmail) return res.status(200).send();
  return res.status(404).send();
}

// function errOnBadEmail(req, res, session) {
//   try {
//     console.log('1');

//     const { authenticatedEmail } = session;
//     const requestEmail = req.params.email;
//     if (requestEmail !== authenticatedEmail) {
//       console.log('MEH');

//       res.status(422).json({ Error: 'invalid email address' });
//       return true;
//     }
//   } catch (error) {
//     console.log('MEH ERR');
//     return res.status(422).json({ Error: 'invalid email address' });
//   }
// }

async function getThemesByUser(req, res) {
  // errOnBadEmail(req, res, req?.session);

  let foundUser = await Users().getThemes({ email: req.params.email });
  // const themes = await Users().readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
  res.status(200).json(foundUser);
  return;
}

async function createUserTheme(req, res) {
  // errOnBadEmail(req, res, req?.session);
  const createObj = {
    email: req.params.email,
    theme: req?.body?.theme,
  };
  if (req.body?.words) {
    createObj.words = req.body.words;
  }
  const created = await Users().createTheme(createObj);

  if (created === 409) return res.status(409).end();
  if (created === 201) return res.status(201).end();

  return res.status(500).json({ Error: `cannot create theme ${req?.body?.theme}` });
}

// async function getUserThemeValue(req, res) {
//   let foundUser = await Users().getThemes({ email: req.params.email });
//   // const themes = await Users().readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
//   res.status(200).json(foundUser);
//   return;
// }

const userByIdRouter = new Router({ mergeParams: true });

userByIdRouter
  .get('/auth', getUserAuthStatus)
  .get('/themes', getThemesByUser)
  .post('/themes', createUserTheme)
  .use('/themes/:theme', userThemeDetailRouter);

export { userByIdRouter };
