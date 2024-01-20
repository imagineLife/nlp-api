import express from 'express';
import natural from 'natural';
import stopword from 'stopword';
import postHandler from './post/index.js';
import excelRouter from './excel/index.js';
import expectTextInBody from '../../../../middleware/expectTextInBody/index.js';
import setupNLPTools from './../../../../lib/textAnalysis/setupNLPTools.js';
import buildArrOfWords from './../../../../lib/textAnalysis/buildArrOfWords/index.js';
import removeStopwords from './../../../../lib/textAnalysis/removeStopwords.js';
import removePunctuation from './../../../../lib/textAnalysis/removePunctuation.js';

const sentimentRouter = express.Router();

const { eng } = stopword; //removeStopwords: rs,
console.log('eng');
console.log(eng);

function cachedStopwordCheck(word) {
  let localCache = {};
  if (localCache[word]) return localCache[word];

  const res = eng.includes(word);
  localCache[word] = res;
  return res;
}
function getAdHocSentimentScore(req, res) {
  const requestedText = decodeURI(req.params.txt);
  console.log('requestedText');
  console.log(requestedText);

  // const sentences = requestedText.split('.').filter((d) => d.length > 0);
  const withoutEndPunc = removePunctuation(requestedText);
  if (!withoutEndPunc || withoutEndPunc?.length === 0) return res.status(200).end();
  const { affinityAnalyzer } = setupNLPTools();

  const sentenceBigrams = natural.NGrams.bigrams(withoutEndPunc);
  console.log('sentenceBigrams');
  console.log(sentenceBigrams);
  let bigramsWithGoodWords = [];

  for (let bigramIdx = 0; bigramIdx < sentenceBigrams.length; bigramIdx++) {
    const thisGram = sentenceBigrams[bigramIdx];
    let [firstWord, secondWord] = thisGram;
    const firstIsStopWord = cachedStopwordCheck(firstWord.toLowerCase());
    const secondIsStopWord = cachedStopwordCheck(secondWord.toLowerCase());
    console.log({ firstIsStopWord, secondIsStopWord });

    const shouldSkipThisGram = firstIsStopWord == true && secondIsStopWord == true;
    if (shouldSkipThisGram === false) {
      // bigramsWithGoodWords.push(thisGram);
      bigramsWithGoodWords.push(firstWord.toLowerCase());
      bigramsWithGoodWords.push(secondWord.toLowerCase());
    } else {
      console.log(`skipping bigram`, thisGram);
    }
  }
  bigramsWithGoodWords = bigramsWithGoodWords.filter(function (item, pos) {
    return bigramsWithGoodWords.indexOf(item) == pos;
  });

  const withoutStopwords = removeStopwords(withoutEndPunc);

  const textArray = buildArrOfWords(withoutEndPunc);
  const withoutStopwordsArr = buildArrOfWords(withoutStopwords);

  const sentimentScore = affinityAnalyzer.getSentiment(textArray);
  const sentWithoutStops = affinityAnalyzer.getSentiment(withoutStopwordsArr);
  const sentBigramBased = affinityAnalyzer.getSentiment(bigramsWithGoodWords);
  return res.status(200).json({
    sentimentScore: Number(sentimentScore.toFixed(1)),
    sentimenScoreLessStopwords: Number(sentWithoutStops.toFixed(1)),
    sentimentBigramBased: sentBigramBased,
  });
}

sentimentRouter.use('/excel', expectTextInBody, excelRouter);
sentimentRouter.get('/ad-hoc/:txt', getAdHocSentimentScore);
sentimentRouter.post('/', expectTextInBody, postHandler);

export default sentimentRouter;
