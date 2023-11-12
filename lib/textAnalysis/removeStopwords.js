import natural from 'natural';
import { removeStopwords as rs } from 'stopword';
const sentenceTokenizer = new natural.SentenceTokenizerNew();
import removeBracketsAndQuotes from './removeBracketsAndQuotes/index.js';
// takes a string...blob?! with punc + etc
// returns string of stopwords
function removeStopwords(s) {
  try {
    // if (s.includes('"')) {
    //   console.log('removing stopwords from s with quote:');
    //   console.log(s);
    // }
    const lessBrackets = removeBracketsAndQuotes(s);
    const tokenized = sentenceTokenizer.tokenize(lessBrackets);
    let withoutStopwords = '';
    tokenized.forEach((sentence) => {
      const lessEndPunctuation = removePunctuation(sentence);
      let withoutStops = rs(lessEndPunctuation.split(' '));
      withoutStopwords += `${withoutStops.join().replace(/\,/g, ' ')} `;
    });
    let res = withoutStopwords.trim();
    if (s.includes('"')) {
      console.log('res');
      console.log(res);
    }

    return res;
  } catch (error) {
    console.log('removeStopwords error on sentence');
    console.log(s);
    console.log(error);
    return '';
  }
}

function removePunctuation(text) {
  // var punctuation = /[\.,?!\[\]]/g;
  const punc = /[\[\]]g/;
  var newText = text.replace(punc, '');
  return newText;
}

export default removeStopwords;
