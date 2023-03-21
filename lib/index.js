import getWordsByCount, { mergeWordsByCount } from './textAnalysis/getWordsByCount.js'
import getLongestThirty from './textAnalysis/getLongestThirty.js'
import convertStringToArr from './textAnalysis/convertStringToArr.js';
import getLongestWord from './textAnalysis/getLongestWord.js';
import getSentenceThemes from './textAnalysis/getSentenceThemes.js';
import buildArrOfWords from './textAnalysis/buildArrOfWords.js';
import buildArrOfSentences from './textAnalysis/buildArrOfSentences.js';
import setupNLPTools from './textAnalysis/setupNLPTools.js';
import { buildThemes } from './themes.js'

export {
  buildArrOfSentences,
  buildArrOfWords,
  buildThemes,
  convertStringToArr,
  getLongestThirty,
  getLongestWord,
  getSentenceThemes,
  getWordsByCount,
  mergeWordsByCount,
  setupNLPTools,
};