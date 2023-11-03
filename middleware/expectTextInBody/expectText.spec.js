import { jest } from '@jest/globals';
import expectTextInBody from './index.js';
describe('expectTextInBody', () => {
  it('calls "next" fn when req.body.text', () => {
    const mockNext = jest.fn();
    expectTextInBody({ body: { text: 'qwer' } }, {}, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('throws when req.body.text not present', () => {
    const mockNext = jest.fn();
    expect(() => {
      expectTextInBody({ body: { noText: 'not-here' } }, {}, mockNext);
    }).toThrow();
  });
});
