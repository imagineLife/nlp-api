import { jest } from '@jest/globals';
import onlyAllowedAnalytic from './index.js';

describe('onlyAllowedAnalytic', () => {
  it('res status 422 when bad anlytic name', () => {
    const mockReq = {
      params: {},
    };
    const mockJsonFn = jest.fn();
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    onlyAllowedAnalytic(mockReq, mockRes);
    expect(mockJsonFn).toHaveBeenCalledWith({ Error: 'Bad Analytic name' });
  });
  describe('calls "next()" with...', () => {
    const analysisTypes = ['bigrams', 'topTenBigrams', 'removeStopwords'];
    analysisTypes.forEach((a) => {
      it(`"${a}"`, () => {
        const mockReq = {
          params: {
            analyticName: a,
          },
        };
        const mockJsonFn = jest.fn();
        const mockNextFn = jest.fn();
        const mockRes = {
          status: () => ({
            json: mockJsonFn,
          }),
        };
        onlyAllowedAnalytic(mockReq, mockRes, mockNextFn);
        expect(mockNextFn).toHaveBeenCalled();
      });
    });
  });
});
