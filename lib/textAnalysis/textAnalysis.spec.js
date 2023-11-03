import convertStringToArr from './convertStringToArr.js';
import getLongestWord from './getLongestWord.js';
import removePunctuation from './removePunctuation.js';
describe('convertStringToArr', () => {
  const tests = [
    {
      inp: 'The quick brown fox jumps.',
      outp: ['The', 'quick', 'brown', 'fox', 'jumps'],
    },
  ];
  tests.forEach((t) => {
    it(`"${t.inp}"`, () => {
      expect(convertStringToArr(t.inp)).toEqual(t.outp);
    });
  });
});

describe('getLongestWord', () => {
  const tests = [
    {
      inp: ['a', 'aa', 'aaa', 'aaaa'],
      outp: 'aaaa',
    },
    {
      inp: ['z', 'yy', 'xxx', 'wwww', '.'],
      outp: 'wwww',
    },
  ];

  tests.forEach((t) => {
    it(`returns "${t.outp}" from ${t.inp}`, () => {
      expect(getLongestWord(t.inp)).toBe(t.outp);
    });
  });
});

// describe('bigrams', () => {
//   const stringSentence = 'This is a long sentence that has a few words in it.';
//   const stringSentences = 'Here is another sentence. This second sentence has more words in it.';
// });

describe('removePunctuation()', () => {
  const tests = [
    {
      s: 'This is a test.',
      ex: 'This is a test',
    },
  ];

  tests.forEach((obj) => {
    it(`given "${obj.s}", returns "${obj.ex}"`, () => {
      expect(removePunctuation(obj.s)).toEqual(obj.ex);
    });
  });
});
