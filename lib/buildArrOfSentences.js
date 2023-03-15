import natural from 'natural'

export default function buildArrOfSentences(txt) {
  const { SentenceTokenizer } = natural;
  const sentenceTokenizer = new SentenceTokenizer();
  return sentenceTokenizer.tokenize(txt);
}
