import natural from 'natural';

function mapToArr(map) {
  return Array.from(map, ([name, value]) => ({ bigram: name, count: value }));
}

function topBigrams(input, optionalLimit) {
  const bigramFn = natural.NGrams.bigrams;
  const stringBigrams = bigramFn(input);
  let innerState = new Map();

  stringBigrams.forEach((bgArr, idx) => {
    const lowerCaseBigram = bgArr.toString().toLowerCase();
    if (!innerState.get(lowerCaseBigram)) {
      innerState.set(lowerCaseBigram, 1);
    } else {
      let curVal = innerState.get(lowerCaseBigram);
      innerState.set(lowerCaseBigram, curVal + 1);
    }
  });
  let res = mapToArr(innerState).sort((a, b) => b.count - a.count);
  if (optionalLimit) {
    return res.slice(0, optionalLimit);
  }
  return res;
}

function topNBigrams(count) {
  return function limitBigramReturn(str) {
    return topBigrams(str, count);
  };
}

export { topNBigrams, topBigrams };
