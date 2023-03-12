/*
  TODO:
  - expect some req.body params
    - text
  - allow a string of sentences
  - returns
    - array of objects: 
     { text: '...', sentiment: NumberHere }
*/ 
import natural from 'natural';

function setupNLPTools() {
  // https://naturalnode.github.io/natural/sentiment_analysis.html
  const { PorterStemmer, SentimentAnalyzer} = natural;
  const language = 'English';

  const SENTIMENT_TYPE = 'afinn';
  const affinityAnalyzer = new SentimentAnalyzer(language, PorterStemmer, SENTIMENT_TYPE);
  return { affinityAnalyzer};
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
  return arr.reduce((a, b) => a.length > b.length ? a : b)
}

function prepSentenceObject(s) { 
  const thisSentenceWordTokens = buildArrOfWords(s);
  const sentScore = affinityAnalyzer.getSentiment(thisSentenceWordTokens);

  let thisObj = new Map();
  thisObj.set('sentence', s);
  thisObj.set('sentimentScore', sentScore);
  thisObj.set('length', thisSentenceWordTokens);
  thisObj.set('longestWord', getLongestWord(s));

  return thisObj;
}

export default function postHandler(req, res) {
  if (!req?.body?.text) {
    throw new Error('expects a json request in the body with a "text" key, like this -> { text: `here`}')
  }

  const { affinityAnalyzer } = setupNLPTools();

  const sentences = buildArrOfSentences(req.body.text);

  const sentenceObj = sentences.map(prepSentenceObject);
  
  return res.json(sentenceObj);
}