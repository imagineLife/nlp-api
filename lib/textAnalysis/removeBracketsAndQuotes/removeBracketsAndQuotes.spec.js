import removeBrackets from './index.js';
describe('removeBrackets', () => {
  it('given "This is a [test].", returns "This is a test."', () => {
    const input = 'This is a [test].';
    const res = removeBrackets(input);
    expect(res).toEqual('This is a test.');
  });
});
