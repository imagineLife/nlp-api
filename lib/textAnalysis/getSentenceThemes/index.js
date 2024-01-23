import { stateObj } from '../../../state.js';

//
// NOTE: in order to use this the `buildThemes` fn must run first in order to populate the stateObj.themeMaps
//
export default function getSentenceThemes(s, themes) {
  let thisSentenceThemes = [];
  const themesToUse = themes || stateObj.themeMaps;

  themesToUse.forEach(({ theme, words }) => {
    // allow for MULTIPLE instance of a theme
    for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
      const thisThemeWord = words[wordIdx];
      // DO NOT ALLOW MULTIPLES: && !thisSentenceThemes.includes(theme)
      if (s.includes(thisThemeWord)) thisSentenceThemes.push(theme);
    }
  });
  return thisSentenceThemes;
}
