import natural from 'natural';
import { removeStopwords } from 'stopword';
/*
  TODO:
  - break a string, or an array of words, into bigrams
    - STORE this?
  - SORT the bigrams by frequency
  -   STORE this?
*/

// https://naturalnode.github.io/natural/stemmers.html
// hmmm...
// natural.PorterStemmer.attach();
// natural.LancasterStemmer.attach();

function removePunctuation(text) {
  var punctuation = /[\.,?!]/g;
  var newText = text.replace(punctuation, '');
  return newText;
}

const stringSentence =
  "This is a long sentence that has a few words in it. Here isn't a long sentence. This longer sentence has more words in it.";

const sentenceTokenizer = new natural.SentenceTokenizerNew();
const wordTokenizer = new natural.WordTokenizer();
const tokenizedSentences = sentenceTokenizer.tokenize(stringSentence);
let wordTokens = [];
let withoutStopwords = [];
tokenizedSentences.forEach((s) => {
  const lessEndPunctuation = removePunctuation(s);
  const withoutStops = removeStopwords(lessEndPunctuation.split(' '));
  withoutStopwords.push(withoutStops);
  let tokenized = wordTokenizer.tokenize(lessEndPunctuation);
  wordTokens = [...wordTokens, ...tokenized];
});

// const bigrams = natural.NGrams.bigrams(stringSentence + stringSentences);
const bigrams = natural.NGrams.bigrams(stringSentence);

let bigramMap = new Map();
bigrams.forEach((bigram) => {
  if (bigramMap.get(`${bigram}`)) {
    let val = bigramMap.get(`${bigram}`);
    bigramMap.set(`${bigram}`, val + 1);
  } else {
    bigramMap.set(`${bigram}`, 1);
  }
});

// Beginning some Query digging:

/*
  AGGREGATION 

  db.Speeches.aggregate(
    [
      { 
        $project: { 
          author: "$author",
          date: "$date",
          wordCount: "$analytics.wordCount",
          sentences: "$analytics.sentenceCount"
        }
      }
    ]
  )


  get all keys at the root of the doc
  using the $$ROOT var:
    https://www.mongodb.com/docs/manual/reference/aggregation-variables/#mongodb-variable-variable.ROOT
    
  db.Speeches.aggregate([
    { "$project": { 
        "arrayofkeyvalue": { 
          "$objectToArray": "$$ROOT" 
        }
      }
    }, 
    { 
      "$unwind": "$arrayofkeyvalue" 
    }, { 
      "$group": { 
        "_id": null, 
        "allkeys": { 
          "$addToSet": "$arrayofkeyvalue.k" 
        } 
      } 
    }
  ])

  returns something like...
  [
  {
    _id: null,
    allkeys: [
      'originalText',
      '_id',
      'analytics',
      'creationDate',
      'author',
      'date',
      'text',
      'updatedDate'
    ]
  }
]
*/
