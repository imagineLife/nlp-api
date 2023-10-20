import convertStringToArr from "./convertStringToArr.js";
import getLongestWord from "./getLongestWord.js";
describe("convertStringToArr", () => {
  const tests = [
    {
      inp: "The quick brown fox jumps.",
      outp: ["The", "quick", "brown", "fox", "jumps"],
    },
  ];
  tests.forEach((t) => {
    it(`"${t.inp}"`, () => {
      expect(convertStringToArr(t.inp)).toEqual(t.outp);
    });
  });
});

describe("getLongestWord", () => {
  const tests = [
    {
      inp: ["a", "aa", "aaa", "aaaa"],
      outp: "aaaa",
    },
  ];

  tests.forEach((t) => {
    it(`returns "${t.outp}" from ${t.inp}`, () => {
      expect(getLongestWord(t.inp)).toBe(t.outp);
    });
  });
});
