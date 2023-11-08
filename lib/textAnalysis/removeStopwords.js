import natural from 'natural';
import { removeStopwords as rs } from 'stopword';
const sentenceTokenizer = new natural.SentenceTokenizerNew();
// takes a string...blob?! with punc + etc
// returns string of stopwords
function removeStopwords(s) {
  const tokenized = sentenceTokenizer.tokenize(s);
  let withoutStopwords = '';
  tokenized.forEach((sentence) => {
    const lessEndPunctuation = removePunctuation(sentence);
    let withoutStops = rs(lessEndPunctuation.split(' '));
    withoutStopwords += `${withoutStops.join().replace(/\,/g, ' ')} `;
  });
  return withoutStopwords.trim();
}

function removePunctuation(text) {
  var punctuation = /[\.,?!]/g;
  var newText = text.replace(punctuation, '');
  return newText;
}

export default removeStopwords;
