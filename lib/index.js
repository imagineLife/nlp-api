import getWordsByCount, { mergeWordsByCount } from './textAnalysis/getWordsByCount.js'
import getLongestThirty from './textAnalysis/getLongestThirty.js'
import convertStringToArr from './textAnalysis/convertStringToArr.js';
import getLongestWord from './textAnalysis/getLongestWord.js';
import getSentenceDetails from './textAnalysis/getSentenceDetails.js';
import getSentenceThemes from './textAnalysis/getSentenceThemes.js';
import buildArrOfWords from './textAnalysis/buildArrOfWords.js';
import buildArrOfSentences from './textAnalysis/buildArrOfSentences/index.js';
import setupNLPTools from './textAnalysis/setupNLPTools.js';
import { buildThemes } from './themes.js'
import { runAnalytics } from './textAnalysis/runAnalytics.js'
export {
  buildArrOfSentences,
  buildArrOfWords,
  buildThemes,
  convertStringToArr,
  getLongestThirty,
  getLongestWord,
  getSentenceDetails,
  getSentenceThemes,
  getWordsByCount,
  mergeWordsByCount,
  runAnalytics,
  setupNLPTools,
};