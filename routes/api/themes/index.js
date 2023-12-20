import { Router } from 'express';
import { Users } from './../../../state.js';

const themesRouter = Router();

async function getThemes(req, res) {
  const themes = await Users().getThemes({ email: req?.params?.email });
  res.status(200).json(themes);
  return;
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
  const created = await Users().createTheme({
    email: req.params.email,
    theme: req?.params.theme,
  });

  if (created === 409) return res.status(409).end();
  if (created === 201) return res.status(201).end();

  return res.status(500).json({ Error: `cannot create theme ${req?.params?.theme}` });
}

async function deleteUserTheme(req, res) {
  // errOnBadEmail(req, res, req?.session);
  try {
    let deleted = await Users().deleteTheme({
      email: req.params.email,
      theme: req?.params.theme,
    });
    if (deleted) return res.status(200).end();
    return res.status(500).json({ Error: '?!' });
  } catch (error) {
    console.log(`deleteTheme Error`);
    console.log(error);
  }
}

async function createUserThemeValue(req, res) {
  // errOnBadEmail(req, res, req?.session);
  // const { authenticatedEmail } = req.session;
  const created = await Users().createThemeValue({
    email: req.params.email,
    theme: req?.params.theme,
    value: req?.params?.val,
  });

  if (!created) {
    return res.status(500).json({
      Error: `cannot create value ${req?.params?.val} for theme ${req?.params?.theme}`,
    });
  } else {
    return res.status(200).end();
  }
}

async function editUserThemeValue(req, res) {
  // errOnBadEmail(req, res, req?.session);
  // const { authenticatedEmail } = req.session;
  const edited = await Users().editThemeValue({
    email: req?.params?.email,
    theme: req?.params.theme,
    value: req?.params?.val,
    newValue: req?.body?.value,
  });
  console.log('edited');
  console.log(edited);

  if (!edited) return res.status(500).json({ Error: `cannot edit theme ${req?.params?.theme}` });
  return res.status(200).end();
}

async function deleteUserThemeValue(req, res) {
  // errOnBadEmail(req, res, req?.session);
  const deleted = await Users().deleteThemeValue({
    email: req.params.email,
    theme: req?.params?.theme,
    value: req?.params?.val,
  });
  console.log('deleted');
  console.log(deleted);

  if (!deleted) {
    return res
      .status(500)
      .json({ Error: `cannot delete theme ${req?.params?.theme} value ${req.params.val}` });
  } else {
    return res.status(200).end();
  }
}

async function getUserThemeValue(req, res) {
  let foundUser = await Users().getThemes({ email: req.params.email });
  // const themes = await Users().readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
  res.status(200).json(foundUser);
  return;
}

themesRouter
  .get('/:email', getThemesByUser)

  // user theme "keys"
  .post('/:email/:theme', createUserTheme)
  .delete('/:email/:theme', deleteUserTheme)

  // user theme "values"
  .get('/:email/:theme/value/:val', getUserThemeValue)
  .post('/:email/:theme/value/:val', createUserThemeValue)
  .put('/:email/:theme/value/:val', editUserThemeValue)
  .delete('/:email/:theme/value/:val', deleteUserThemeValue)
  .get('/', getThemes);
export default themesRouter;
