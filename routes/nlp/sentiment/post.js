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

export default function postHandler(req, res) {
  if (!req?.body?.text) {
    throw new Error('expects a json request in the body with a "text" key, like this -> { text: `here`}')
  }

  const { affinityAnalyzer } = setupNLPTools();

  const sentences = buildArrOfSentences(req.body.text);

  const resObj = sentences.map(s => {
    let thisObj = {};
    thisObj.sentence = s;

    const thisSentenceWordTokens = buildArrOfWords(s);
    const sentScore = affinityAnalyzer.getSentiment(thisSentenceWordTokens)
    thisObj.sentiment = sentScore;
    return thisObj;
  })
  
  return res.json(resObj);
}