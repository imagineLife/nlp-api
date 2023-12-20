import { Router } from 'express';
import { Users } from '../../../../state.js';

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
  const created = await Users().createTheme({
    email: req.params.email,
    theme: req?.body?.theme,
  });

  if (created === 409) return res.status(409).end();
  if (created === 201) return res.status(201).end();

  return res.status(500).json({ Error: `cannot create theme ${req?.body?.theme}` });
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

// async function getUserThemeValue(req, res) {
//   let foundUser = await Users().getThemes({ email: req.params.email });
//   // const themes = await Users().readMany({}, { theme: '$_id', _id: 0, keyWords: '$words' });
//   res.status(200).json(foundUser);
//   return;
// }

const userByIdRouter = new Router({ mergeParams: true });

const userThemeDetailRouter = new Router({ mergeParams: true });

userThemeDetailRouter
  .delete('/', deleteUserTheme)
  // .get('/value/:val', getUserThemeValue)
  .post('/values', createUserThemeValue)
  .put('/values/:val', editUserThemeValue)
  .delete('/values/:val', deleteUserThemeValue);

userByIdRouter
  .get('/auth', getUserAuthStatus)
  .get('/themes', getThemesByUser)
  .post('/themes', createUserTheme)
  .use('/themes/:theme', userThemeDetailRouter);

export { userByIdRouter };
