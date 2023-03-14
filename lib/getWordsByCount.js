// creates an object of the most-frequent words occuring
export default function getWordsByCount(srcWordArr) {
  // const startingArr = typeof srcWordArr === 'string' ? convertStrToWordArr(srcWordArr) : srcWordArr;

  // https://en.wikipedia.org/wiki/Most_common_words_in_English
  const topThirty = [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'i',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    '',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
  ];
  const freqUsedWords = [];

  // startingArr
  srcWordArr.forEach((singleWord) => {
    const lowerCaseWord = singleWord.toLowerCase();
    let thisIndex = null;
    // check if this word is already in array
    if (
      freqUsedWords.some((arrObj, arrObjInd) => {
        if (arrObj.word == lowerCaseWord) {
          thisIndex = arrObjInd;
        }
        return arrObj.word == lowerCaseWord;
      })
    ) {
      freqUsedWords[thisIndex].occurances += 1;
    } else {
      // if this word is NOT in the topThirty array, add to freqWords
      if (!topThirty.includes(lowerCaseWord)) {
        freqUsedWords.push({ word: singleWord.toLowerCase(), occurances: 1 });
      } else return;
    }
  });

  freqUsedWords.sort((a, b) => b.occurances - a.occurances);
  return freqUsedWords;
}
