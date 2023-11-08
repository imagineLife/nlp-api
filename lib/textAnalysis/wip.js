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

const s1 = `On this day, prescribed by law and marked by ceremony, we celebrate the durable wisdom of our Constitution and recall the deep commitments that unite our country. I am grateful for the honor of this hour, mindful of the consequential times in which we live, and determined to fulfill the oath that I have sworn and you have witnessed.`;
const s2 = `At this second gathering, our duties are defined not by the words I use but by the history we have seen together. For a half a century, America defended our own freedom by standing watch on distant borders. After the shipwreck of communism came years of relative quiet, years of repose, years of sabbatical, and then there came a day of fire.`;
const s3 = `We have seen our vulnerability, and we have seen its deepest source. For as long as whole regions of the world simmer in resentment and tyranny, prone to ideologies that feed hatred and excuse murder, violence will gather and multiply in destructive power and cross the most defended borders and raise a mortal threat. There is only one force of history that can break the reign of hatred and resentment and expose the pretensions of tyrants and reward the hopes of the decent and tolerant, and that is the force of human freedom.`;
// const stringSentence = `${s1} ${s2} ${s3}`;

//
// 1. tokenize sentences
//
const sentenceTokenizer = new natural.SentenceTokenizerNew();
const wordTokenizer = new natural.WordTokenizer();
// const tokenizedSentences = sentenceTokenizer.tokenize(stringSentence);
// console.log('tokenizedSentences');
// console.log(tokenizedSentences);
const tokenizedS1 = sentenceTokenizer.tokenize(s1);

//
// loop + analyze
//
let wordTokens = [];
let withoutStopwords = [];
tokenizedS1.forEach((s) => {
  const lessEndPunctuation = removePunctuation(s);

  const withoutStops = removeStopwords(lessEndPunctuation.split(' '));
  withoutStopwords.push(withoutStops);
  let tokenized = wordTokenizer.tokenize(lessEndPunctuation);
  wordTokens = [...wordTokens, ...tokenized];
});
console.log('withoutStopwords');
console.log(withoutStopwords);

// const bigrams = natural.NGrams.bigrams(stringSentence + stringSentences);
// const bigrams = natural.NGrams.bigrams(stringSentence);

// let bigramMap = new Map();
// bigrams.forEach((bigram) => {
//   if (bigramMap.get(`${bigram}`)) {
//     let val = bigramMap.get(`${bigram}`);
//     bigramMap.set(`${bigram}`, val + 1);
//   } else {
//     bigramMap.set(`${bigram}`, 1);
//   }
// });

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



  
  // see keys of root.analytics (only 1 difference from the previous block)
  db.Speeches.aggregate([
    { "$project": { 
        "arrayofkeyvalue": { 
          "$objectToArray": "$$ROOT.analytics" 
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





  GET SIZE of documents!! interesting
  // "size_bytes": { "$bsonSize": "$$ROOT" },
  // "size_KB": { "$divide": [{"$bsonSize": "$$ROOT"}, 1000] },  
  db.Speeches.aggregate([ 
    { 
      $project: { 
        mbSize: { 
          $round: [
            { 
              $divide: [
                { $bsonSize: "$$ROOT" }, 
                1000000
              ] 
            }, 
            2
          ] 
        }, 
        author: 1, 
        _id: 0, 
        words: '$analytics.wordCount' 
      }
    },
    { 
      $sort: { mbSize: -1 }  
    }
  ])
*/
