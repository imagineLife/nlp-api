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

const stringSentence =
  "This is a long sentence that has a few words in it. Here isn't a long sentence. This longer sentence has more words in it.";

const sentenceTokenizer = new natural.SentenceTokenizerNew();
const wordTokenizer = new natural.WordTokenizer();
const tokenizedSentences = sentenceTokenizer.tokenize(stringSentence);
let wordTokens = [];
let withoutStopwords = [];
tokenizedSentences.forEach((s) => {
  const withoutStops = removeStopwords(s.split(' '));
  withoutStopwords.push(withoutStops);
  let tokenized = wordTokenizer.tokenize(s);
  wordTokens = [...wordTokens, ...tokenized];
});
console.log('withoutStopwords');
console.log(withoutStopwords);

// const bigrams = natural.NGrams.bigrams(stringSentence + stringSentences);
const bigrams = natural.NGrams.bigrams(stringSentence);
console.log('bigrams');
console.log(bigrams);

let bigramMap = new Map();
bigrams.forEach((bigram) => {
  if (bigramMap.get(`${bigram}`)) {
    let val = bigramMap.get(`${bigram}`);
    bigramMap.set(`${bigram}`, val + 1);
  } else {
    bigramMap.set(`${bigram}`, 1);
  }
});

console.log('bigramMap');
console.log(bigramMap);
