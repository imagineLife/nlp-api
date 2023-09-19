import { ObjectId } from 'mongodb';
import { buildArrOfSentences, getLongestThirty, getSentenceDetails, getWordsByCount } from './../index.js';
import { speeches } from './../../state.js';

// const analyticsToRun = ['wordsByCount'];

// const analyticsToFunction = {
//   wordsByCount: getWordsByCount,
// };
async function runAnalytics(speechId) {
  console.time('runAnalytics');

  // let runThese = [...analyticsToRun];
  let { text } = await speeches().findOne({ _id: new ObjectId(speechId) });
  
  const arrOfSentences = buildArrOfSentences(text);
  const wordsByCount = getWordsByCount(arrOfSentences);
  const longestThirty = getLongestThirty(arrOfSentences);
  
  const { summary: { sentences, words, sentiments, themes }, sentenceArr } = getSentenceDetails(arrOfSentences);
  
  let updated = await speeches().updateOne(
    { _id: new ObjectId(speechId) },
    {
      $set: {
        'analytics.wordsByCount': wordsByCount,
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
  console.log('updated');
  console.log(updated);

  console.timeEnd('runAnalytics');
}

export { runAnalytics };
