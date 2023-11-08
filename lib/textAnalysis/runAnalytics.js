import { ObjectId } from 'mongodb';
import {
  buildArrOfSentences,
  convertStringToArr,
  getLongestThirty,
  getSentenceDetails,
  // getWordsByCount,
} from './../index.js';
import removeStopwords from './../../lib/textAnalysis/removeStopwords.js';
import { get } from './../../state.js';
import natural from 'natural';

async function runAnalytics(speechId) {
  try {
    let { text } = await get('Speeches').findOne({
      _id: new ObjectId(speechId),
    });

    const lessStopwords = removeStopwords(text);
    const entireArray = convertStringToArr(text);
    const arrOfSentences = buildArrOfSentences(text);

    const longestThirty = getLongestThirty(entireArray);

    const {
      summary: { sentences, words, sentiments, themes },
      sentenceArr,
    } = getSentenceDetails(arrOfSentences);

    const avgWordsPerSentence = Math.round(words / sentences);
    const bigrams = natural.NGrams.bigrams(text);
    const trigrams = natural.NGrams.trigrams(text);
    await get('Speeches').updateOne(
      { _id: new ObjectId(speechId) },
      {
        $set: {
          'analytics.lessStopwords': lessStopwords,
          'analytics.ngrams.bigrams.complete': bigrams,
          'analytics.ngrams.trigrams.complete': trigrams,
          'analytics.longestThirty': longestThirty,
          'analytics.sentences': sentenceArr,
          'analytics.sentenceCount': sentences,
          'analytics.sentiments': sentiments,
          'analytics.themesCounts': themes,
          'analytics.wordCount': words,
          'analytics.avgWordsPerSentence': avgWordsPerSentence,
          updatedDate: new Date(),
        },
      }
    );
    return true;
  } catch (error) {
    console.log(`runAnalytics error`);
    console.log(error);
    return false;
  }
}

export { runAnalytics };
