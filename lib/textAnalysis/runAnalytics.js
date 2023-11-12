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
  console.time(`runAnalytics ${speechId}`);
  try {
    let { text } = await get('Speeches').findOne({
      _id: new ObjectId(speechId),
    });

    const lessStopwords = removeStopwords(text);
    const entireArray = convertStringToArr(text);
    const arrOfSentences = buildArrOfSentences(text);

    const {
      summary: { sentences, words, sentiments, themes },
      sentenceArr,
    } = getSentenceDetails(arrOfSentences);

    const longestThirty = getLongestThirty(entireArray);
    const avgWordsPerSentence = Math.round(words / sentences);

    //
    // nGrams
    //
    const bigrams = natural.NGrams.bigrams(text);
    const trigrams = natural.NGrams.trigrams(text);

    const lessStopBigrams = natural.NGrams.bigrams(lessStopwords);
    const lessStopTrigrams = natural.NGrams.trigrams(lessStopwords);
    await get('Speeches').updateOne(
      { _id: new ObjectId(speechId) },
      {
        $set: {
          'analytics.lessStopwords.text': lessStopwords,
          'analytics.lessStopwords.bigrams': lessStopBigrams,
          'analytics.lessStopwords.trigrams': lessStopTrigrams,
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
    console.timeEnd(`runAnalytics ${speechId}`);
    return true;
  } catch (error) {
    console.log(`runAnalytics error`);
    console.log(error);
    console.timeEnd(`runAnalytics ${speechId}`);
    return false;
  }
}

export { runAnalytics };
