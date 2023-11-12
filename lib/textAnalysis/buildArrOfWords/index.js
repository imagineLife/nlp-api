// import natural from 'natural';

export default function buildArrOfWords(s) {
  try {
    // const { WordTokenizer } = natural;
    // const wordTokenizer = new WordTokenizer();
    // return wordTokenizer.tokenize(s);
    let sentenceArr = s.match(/\S+\s*/g);
    return sentenceArr.map((w) => w.replace(' ', '').replace('.', ''));
  } catch (error) {
    console.log('buildArrOfWords err on sentence ');
    console.log(s);
    console.log(e);
  }
}
