import buildArrayOfSentences from './index.js';

describe('textAnalysis', () => { 
  it('splits 3 sentences', () => { 
    const input = 'This is sentence one. This is sentence two! And this is also sentence three?';
    
    let res = buildArrayOfSentences(input);
    expect(res.length).toBe(3);
    expect(res[0]).toBe('This is sentence one.');
    expect(res[1]).toBe('This is sentence two!');
    expect(res[2]).toBe('And this is also sentence three?');
  })
})