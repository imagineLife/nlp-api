import getWordsByCount, { mergeWordsByCount } from './index.js';

describe('getWordsByCount', () => { 
  it('works', () => { 
    let input = ['one', 'two', 'two', 'three', 'three', 'three', 'four', 'four', 'four', 'four'];
    const output = [
      { occurrences: 4, word: 'four' },
      { occurrences: 3, word: 'three' },
      { occurrences: 2, word: 'two' },
      { occurrences: 1, word: 'one' },
    ];
    expect(getWordsByCount(input)).toStrictEqual(output)
  })
})

describe('mergeWordsByCount', () => { 
  it('works', () => { 
    const oldArr = [
      { occurrences: 4, word: 'four' },
      { occurrences: 3, word: 'three' },
      { occurrences: 2, word: 'two' },
      { occurrences: 1, word: 'one' },
    ];
    const newArr = [
      { occurrences: 2, word: 'two' },
      { occurrences: 1, word: 'one' },
    ];
    const res = [
      { occurrences: 4, word: 'four' },
      { occurrences: 3, word: 'three' },
      { occurrences: 4, word: 'two' },
      { occurrences: 2, word: 'one' },
    ];
    expect(mergeWordsByCount(oldArr, newArr)).toEqual(res);
  })
});