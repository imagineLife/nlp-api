import { stateObj } from './../state.js';

export default function getSentenceThemes(s) {
  let thisSentenceThemes = []

  // loop through obj of theme maps
  Object.keys(stateObj.maps).forEach(themeName => {
    const thisMap = stateObj.maps[`${themeName}`];
    // forEach theme, loop through theme keywords
    for (let [key] of thisMap) {
      if(s.toLowerCase().includes(key.toLowerCase())) thisSentenceThemes.push(themeName);
    }
  })

  if (thisSentenceThemes.length === 0) {
    console.log('----NO THEME HERE----')
    console.log(s)
    console.log('-----')
  }

  return thisSentenceThemes
}