import getLongestThirty from "./index.js";

describe('getLongestThirty', () => { 
  it('returns all words when less than 30 words', () => {
    const input = ['a', 'aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa']
    const res = getLongestThirty(input)
    expect(JSON.stringify(res)).toBe(JSON.stringify(['aaaaaa', 'aaaaa', 'aaaa', 'aaa', 'aa', 'a']));
  })

  it('removes duplicates AND returns all words when less than 30 words', () => {
      const input = ['a', 'a', 'aa','aa', 'aaa', 'aaaa', 'aaaaa', 'aaaaaa'];
      const res = getLongestThirty(input);
      expect(JSON.stringify(res)).toBe(
        JSON.stringify(['aaaaaa', 'aaaaa', 'aaaa', 'aaa', 'aa', 'a'])
      );
  });
})