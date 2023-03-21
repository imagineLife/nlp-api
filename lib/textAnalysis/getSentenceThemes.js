import { stateObj } from './../../state.js';

function escapeRegExp(string) {
  return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

export default function getSentenceThemes(s) {
  let thisSentenceThemes = []

  // loop through obj of theme maps
  Object.keys(stateObj.maps).forEach(themeName => {
    const thisMap = stateObj.maps[`${themeName}`];
    // forEach theme, loop through theme keywords
    for (let [key] of thisMap) {
      
      // don't look through ALL words of a theme once the theme has been included in the sentenceThemes arr
      if (!thisSentenceThemes.includes(themeName)) {
        let regex = '\\b';
        regex += escapeRegExp(key);
        regex += '\\b';
        let res = new RegExp(regex, 'i').test(s.toLowerCase());
        if (res === true) thisSentenceThemes.push(themeName);
      }
    }
  })
  return thisSentenceThemes
}