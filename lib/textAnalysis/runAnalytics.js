import { ObjectId } from 'mongodb';
import {
  buildArrOfSentences,
  convertStringToArr,
  getLongestThirty,
  getSentenceDetails,
  // getWordsByCount,
} from './../index.js';
import { get } from './../../state.js';

async function runAnalytics(speechId) {
  console.time('runAnalytics');
  try {
    let { text } = await get('Speeches').findOne({
      _id: new ObjectId(speechId),
    });
    const entireArray = convertStringToArr(text);
    const arrOfSentences = buildArrOfSentences(text);
    const longestThirty = getLongestThirty(entireArray);

    const {
      summary: { sentences, words, sentiments, themes },
      sentenceArr,
    } = getSentenceDetails(arrOfSentences);

    await get('Speeches').updateOne(
      { _id: new ObjectId(speechId) },
      {
        $set: {
          // 'analytics.wordsByCount': wordsByCount,
          'analytics.longestThirty': longestThirty,
          'analytics.sentences': sentenceArr,
          'analytics.sentenceCount': sentences,
          'analytics.wordCount': words,
          'analytics.sentiments': sentiments,
          'analytics.themesCounts': themes,
          updatedDate: new Date(),
        },
      }
    );
    console.timeEnd('runAnalytics');
    return true;
  } catch (error) {
    console.log(`runAnalytics error`);
    console.log(error);
    console.timeEnd('runAnalytics');
    return false;
  }
}

export { runAnalytics };
