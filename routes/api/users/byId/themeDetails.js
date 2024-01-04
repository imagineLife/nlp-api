import { Router } from 'express';
import { Users } from '../../../../state.js';

const userThemeDetailRouter = new Router({ mergeParams: true });

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
    value: req?.body?.value,
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

userThemeDetailRouter
  // .get('/value/:val', getUserThemeValue)
  .post('/values', createUserThemeValue)
  .put('/values/:val', editUserThemeValue)
  .delete('/values/:val', deleteUserThemeValue)
  .delete('/', deleteUserTheme);

export { userThemeDetailRouter };
