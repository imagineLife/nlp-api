import natural from 'natural';

export default function buildArrOfWords(s) {
  const { WordTokenizer } = natural;
  const wordTokenizer = new WordTokenizer();
  return wordTokenizer.tokenize(s);
}
