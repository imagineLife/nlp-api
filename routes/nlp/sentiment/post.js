import natural from 'natural';
import { convertStringToArr, getWordsByCount, getLongestThirty } from './../../../lib/index.js'
// import summaryObj from './summaryObj.js';

function setupNLPTools() {
  // https://naturalnode.github.io/natural/sentiment_analysis.html
  const { PorterStemmer, SentimentAnalyzer } = natural;
  const language = 'English';

  const SENTIMENT_TYPE = 'afinn';
  const affinityAnalyzer = new SentimentAnalyzer(language, PorterStemmer, SENTIMENT_TYPE);
  return { affinityAnalyzer };
}

function buildArrOfSentences(txt) {
  const { SentenceTokenizer } = natural;
  const sentenceTokenizer = new SentenceTokenizer();
  return sentenceTokenizer.tokenize(txt);
}

function buildArrOfWords(s) {
  const { WordTokenizer } = natural;
  const wordTokenizer = new WordTokenizer();
  return wordTokenizer.tokenize(s);
}

function getLongestWord(arr) {
  return arr.reduce((a, b) => (a.length > b.length ? a : b));
}

export default function postHandler(req, res) {

  const entireArray = convertStringToArr(req.body.text);
  const wordsByCount = getWordsByCount(entireArray)
  const longestThirty = getLongestThirty(entireArray)
  
  
  const sentences = buildArrOfSentences(req.body.text);

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
    wordsByCount,
    longestThirty
  };
  sentences.forEach((s) => {
    const { affinityAnalyzer } = setupNLPTools();
    const thisSentenceWordTokens = buildArrOfWords(s);
    const sentScore = affinityAnalyzer.getSentiment(thisSentenceWordTokens);

    // create sentence obj
    let thisObj = {};
    thisObj.sentence = s;
    thisObj.sentimentScore = sentScore;
    thisObj.length = thisSentenceWordTokens.length;
    thisObj.longestWord = getLongestWord(thisSentenceWordTokens);
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

  res.json({ summary: internalSummary, sentenceAnalysis: sentenceArr });
  sentenceArr = null;
  internalSummary = null;
  return;
}
