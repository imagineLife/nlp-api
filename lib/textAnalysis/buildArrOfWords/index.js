export default function buildArrOfWords(s) {
  let sentenceArr = s.match(/\S+\s*/g);
  return sentenceArr.map((w) => w.replace(' ', '').replace('.', ''));
}
