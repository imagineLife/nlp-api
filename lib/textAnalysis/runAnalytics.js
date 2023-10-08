import { ObjectId } from 'mongodb';
import { buildArrOfSentences, getLongestThirty, getSentenceDetails, getWordsByCount } from './../index.js';
import { speeches } from './../../state.js';

async function runAnalytics(speechId) {
  // console.time('runAnalytics');
  try {
    let { text } = await speeches().findOne({ _id: new ObjectId(speechId) });    
    const arrOfSentences = buildArrOfSentences(text);    
    const longestThirty = getLongestThirty(arrOfSentences);
    
    const {
      summary: { sentences, words, sentiments, themes },
      sentenceArr,
    } = getSentenceDetails(arrOfSentences);

    await speeches().updateOne(
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

    return true
  } catch (error) {
    console.log(`runAnalytics error`)
    console.log(error)
    console.timeEnd('runAnalytics');
    return false;
  }
}

export { runAnalytics };
