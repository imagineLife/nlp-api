import natural from 'natural';
import { setupNLPTools, getLongestWord, getSentenceThemes, buildArrOfWords } from './../index.js';
import removeStopwords from './removeStopwords.js';
import removePunctuation from './removePunctuation.js';

export default function getSentenceDetails(arrOfSentences) {
  let sentenceArr = [];
  let internalSummary = {
    sentences: 0,
    words: 0,
    sentiments: {
      positive: {
        count: 0,
        percent: 0,
      },
      negative: {
        count: 0,
        percent: 0,
      },
      neutral: {
        count: 0,
        percent: 0,
      },
    },
    themes: [],
  };
  arrOfSentences.forEach((s) => {
    const withoutEndPunc = removePunctuation(s);
    if (!withoutEndPunc || withoutEndPunc?.length === 0) return;
    const { affinityAnalyzer } = setupNLPTools();
    const sentenceThemes = getSentenceThemes(withoutEndPunc);
    const sentenceWordsArr = buildArrOfWords(withoutEndPunc);
    const sentScore = affinityAnalyzer.getSentiment(sentenceWordsArr);
    const sentenceBigrams = natural.NGrams.bigrams(withoutEndPunc);
    const sentenceTrigrams = natural.NGrams.trigrams(withoutEndPunc);

    // stopword impact
    const lessStopwords = removeStopwords(withoutEndPunc);
    const lessStopWordsArr = lessStopwords ? buildArrOfWords(lessStopwords) : '';
    const sentimentLessStopwords = lessStopWordsArr
      ? affinityAnalyzer.getSentiment(lessStopWordsArr)
      : null;

    // create sentence obj
    let thisObj = {};
    thisObj.sentence = s;
    thisObj.sentimentScore = {
      originalText: sentScore,
      lessStopWords: sentimentLessStopwords,
    };
    thisObj.length = sentenceWordsArr.length;
    thisObj.longestWord = getLongestWord(sentenceWordsArr);
    thisObj.themes = sentenceThemes;
    thisObj.bigrams = sentenceBigrams;
    thisObj.trigrams = sentenceTrigrams;
    thisObj.lessStopwords = lessStopwords;
    internalSummary.themes.push(sentenceThemes);
    sentenceArr.push(thisObj);

    // update summary
    internalSummary.sentences = internalSummary.sentences + 1;
    internalSummary.words = internalSummary.words + thisObj.length;

    if (sentScore > 0) {
      internalSummary.sentiments.positive.count = internalSummary.sentiments.positive.count + 1;
    }
    if (sentScore < 0) {
      internalSummary.sentiments.negative.count = internalSummary.sentiments.negative.count + 1;
    }
    if (sentScore == 0) {
      internalSummary.sentiments.neutral.count = internalSummary.sentiments.neutral.count + 1;
    }

    internalSummary.sentiments.positive.percent = Math.round(
      (internalSummary.sentiments.positive.count / internalSummary.sentences) * 100,
      0
    );
    internalSummary.sentiments.negative.percent = Math.round(
      (internalSummary.sentiments.negative.count / internalSummary.sentences) * 100,
      0
    );
    internalSummary.sentiments.neutral.percent = Math.round(
      (internalSummary.sentiments.neutral.count / internalSummary.sentences) * 100,
      0
    );
  });

  // update summary Theme Data
  internalSummary.themes = internalSummary.themes.reduce((curObj, sentenceArray) => {
    let reduceObjCopy = curObj;
    sentenceArray.forEach((themeWord) => {
      if (!reduceObjCopy[themeWord]) {
        reduceObjCopy[themeWord] = 1;
      } else {
        reduceObjCopy[themeWord] = reduceObjCopy[themeWord] + 1;
      }
    });
    return reduceObjCopy;
  }, {});

  internalSummary.themes = Object.keys(internalSummary.themes)
    .map((theme) => ({
      theme,
      sentences: internalSummary.themes[theme],
    }))
    .sort((a, b) => b.sentences - a.sentences);
  return { summary: internalSummary, sentenceArr };
}
