import natural from 'natural';
import { removeStopwords as rs } from 'stopword';
const sentenceTokenizer = new natural.SentenceTokenizerNew();

// takes a string...blob?! with punc + etc
// returns string of stopwords
function removeStopwords(s) {
  try {
    const lessPunc = removePunctuation(s);
    const tokenized = sentenceTokenizer.tokenize(lessPunc);
    let withoutStopwords = '';
    tokenized.forEach((sentence) => {
      const lessEndPunctuation = removePunctuation(sentence);
      let withoutStops = rs(lessEndPunctuation.split(' '));
      withoutStopwords += `${withoutStops.join().replace(/\,/g, ' ')} `;
    });
    let res = withoutStopwords.trim();
    return res;
  } catch (error) {
    throw new Error(`removeStopwords error on sentence "${s}"`);
  }
}

function removePunctuation(text) {
  var punc = /[\.,?!\[\]]/g;
  // const punc = /[\[\]]g/;
  var newText = text.replace(punc, '');
  return newText;
}

export default removeStopwords;
