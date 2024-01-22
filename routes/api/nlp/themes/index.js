import { getSentenceThemes } from './../../../../lib/index.js';
import { stateObj, Users } from '../../../../state.js';

async function getAdHocThemes(req, res) {
  try {
    const userEmail = res?.locals?.jwt?.email;

    if (!stateObj?.userData?.[userEmail]?.themes) {
      let userThemes = await Users().getThemes({ email: res?.locals?.jwt?.email });
      stateObj.userData[userEmail] = {};
      stateObj.userData[userEmail].themes = userThemes;
    }

    const userThemes = stateObj.userData[userEmail].themes;
    const requestedText = decodeURI(req.params.txt);
    const sentenceThemes = getSentenceThemes(requestedText, userThemes);
    return res.status(200).json(sentenceThemes);
  } catch (error) {
    console.log('error');
    console.log(error);
    return res.status(500).json({ error: 'getAdHocThemes Error' });
  }
}

import express from 'express';
const themeRouter = express.Router();

themeRouter.get('/ad-hoc/:txt', getAdHocThemes);

export default themeRouter;
