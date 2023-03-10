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
  const { PorterStemmer, SentimentAnalyzer, SentenceTokenizer, WordTokenizer } = natural;
  const sentenceTokenizer = new SentenceTokenizer();
  const wordTokenizer = new WordTokenizer();
  const language = 'English';

  const SENTIMENT_TYPE = 'afinn';
  const affinityAnalyzer = new SentimentAnalyzer(language, PorterStemmer, SENTIMENT_TYPE);
  return { affinityAnalyzer, sentenceTokenizer, wordTokenizer};
}


export default function postHandler(req, res) {
  if (!req?.body?.text) {
    throw new Error('expects a json request in the body with a "text" key, like this -> { text: `here`}')
  }

  const { affinityAnalyzer, sentenceTokenizer, wordTokenizer } = setupNLPTools();

  const sentences = sentenceTokenizer.tokenize(req.body.text);
  const resObj = sentences.map(s => {
    let thisObj = {};
    thisObj.sentence = s;

    const thisSentenceWordTokens = wordTokenizer.tokenize(s);
    thisObj.sentiment = affinityAnalyzer.getSentiment(thisSentenceWordTokens);
    return thisObj;
  })
  
  return res.json(resObj);
}