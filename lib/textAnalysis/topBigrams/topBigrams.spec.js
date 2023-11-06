import { topBigrams, topNBigrams } from './index.js';

describe('topBigrams', () => {
  it('works', () => {
    let input =
      'This is sentence one. This is another sentence. Here is yet another sentence. And at last, another sentence.';
    let outputs = [
      {
        bigram: 'another,sentence',
        count: 3,
      },
      {
        bigram: 'this,is',
        count: 2,
      },
    ];
    const res = topBigrams(input);
    expect(res[0]).toEqual(outputs[0]);
    expect(res[1]).toEqual(outputs[1]);
  });
});

describe('topNBigrams', () => {
  it('works', () => {
    let input =
      'This is sentence one. This is another sentence. Here is yet another sentence. And at last, another sentence.';
    let outputs = [
      {
        bigram: 'another,sentence',
        count: 3,
      },
    ];
    const firstBigram = topNBigrams(1);
    const res = firstBigram(input);

    expect(res[0]).toEqual(outputs[0]);
    expect(res.length).toBe(1);
  });
});
