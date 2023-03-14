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

export default function postHandler(req, res) {
  if (!req?.body?.text) {
    throw new Error('expects a json request in the body with a "text" key, like this -> { text: `here`}')
  }

  const sentences = buildArrOfSentences(req.body.text);

  let summary = {
    sentences: 0,
    agvWordsPerSentence: 0,
    words: 0,
    sentiments: {
      positive: {
        count: 0,
        percent: 0
      },
      negative: {
        count: 0,
        percent: 0
      },
      neutral: {
        count: 0,
        percent: 0
      },
    }
  }

  let sentenceArr = []
  sentences.forEach(s => {
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
    summary.sentences = summary.sentences + 1;
    summary.words = summary.words + thisObj.length
    
    if (sentScore > 0) {
      summary.sentiments.positive.count = summary.sentiments.positive.count + 1
    }
    if (sentScore < 0) {
      summary.sentiments.negative.count = summary.sentiments.negative.count + 1;
    }
    if (sentScore == 0) {
      summary.sentiments.neutral.count = summary.sentiments.neutral.count + 1;
    }

    summary.sentiments.positive.percent = Math.round((summary.sentiments.positive.count / summary.sentences) * 100, 0)
    summary.sentiments.negative.percent = Math.round(
      (summary.sentiments.negative.count / summary.sentences) * 100,
      0
    );
    summary.sentiments.neutral.percent = Math.round(
      (summary.sentiments.neutral.count / summary.sentences) * 100,
      0
    );
  });
  

  res.json({ summary, sentenceAnalysis: sentenceArr});
  sentenceArr = null;
  return;
}