import buildArrOfWords from './index.js';

describe('buildArrOfWords', () => { 
  it('works', () => { 
    const input = 'This is a sentence.'
    const res = buildArrOfWords(input);
    expect(JSON.stringify(res)).toBe(JSON.stringify(['This', 'is', 'a', 'sentence']));
  })
})