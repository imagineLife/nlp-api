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
    return res.status(500).json({ Error: 'Error deleting theme' });
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

async function editUserTheme(req, res) {
  try {
    //
    // get current theme
    //
    let currentTheme = await Users().getSingleTheme({
      email: req.params.email,
      currentTheme: req.params.theme,
      newTheme: req.body.newTheme,
    });
    currentTheme = await currentTheme.toArray();

    //
    // create new theme object
    //
    const newTheme = {
      email: req.params.email,
      theme: req.body.newTheme,
      words: currentTheme[0].words,
    };

    // insert new theme
    const created = await Users().createTheme(newTheme);

    if (created !== 201) {
      console.log('Error creating a new theme');
      return res.status(500).json({ Error: 'server error' });
    }

    // DELETE "old" theme...
    let deleted = await Users().deleteTheme({
      email: req.params.email,
      theme: req?.params.theme,
    });
    if (!deleted) {
      return res.status(500).json({ Error: 'Error deleting theme' });
    }
    return res.status(201).json();
  } catch (error) {
    console.log(`editTheme Error`);
    console.log(error);
    return res.status(500).end();
  }
}

async function getUserTheme(req, res) {
  try {
    let currentTheme = await Users().getSingleTheme({
      email: req.params.email,
      currentTheme: req.params.theme,
      newTheme: req.body.newTheme,
    });
    currentTheme = await currentTheme.toArray();
    return res.status(200).json(currentTheme);
  } catch (error) {
    console.log('getUserTheme error');
    console.log(error);
    return res.status(500).json({ Error: 'server error' });
  }
}

userThemeDetailRouter
  .post('/values', createUserThemeValue)
  .put('/values/:val', editUserThemeValue)
  .delete('/values/:val', deleteUserThemeValue)
  .get('/', getUserTheme)
  .patch('/', editUserTheme)
  .delete('/', deleteUserTheme);
// .get('/value/:val', getUserThemeValue)

export { userThemeDetailRouter };
