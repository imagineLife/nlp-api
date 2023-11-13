import convertStringToArr from './convertStringToArr.js';
import getLongestWord from './getLongestWord.js';
import removePunctuation from './removePunctuation.js';
import removeStopwords from './removeStopwords.js';
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

describe('removeStopwords', () => {
  it('succeeds', () => {
    let input = `On this day, prescribed by law and marked by ceremony, we celebrate the durable wisdom of our Constitution and recall the deep commitments that unite our country. I am grateful for the honor of this hour, mindful of the consequential times in which we live, and determined to fulfill the oath that I have sworn and you have witnessed.`;
    const output =
      'day prescribed law marked ceremony celebrate durable wisdom Constitution recall deep commitments unite country grateful honor hour mindful consequential times live determined fulfill oath sworn witnessed';
    let res = removeStopwords(input);
    expect(res).toEqual(output);
  });

  it('throws when input has [', () => {
    let input = `This is a sentence \``;
    expect(() => {
      removeStopwords(input);
    }).toThrow('removeStopwords error on sentence "This is a sentence `"');
  });
});
