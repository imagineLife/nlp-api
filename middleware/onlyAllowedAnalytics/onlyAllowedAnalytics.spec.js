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
  it('calls next with "bigrams"', () => {
    const mockReq = {
      params: {
        analyticName: 'bigrams',
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
  it('calls next with "topTenBigrams"', () => {
    const mockReq = {
      params: {
        analyticName: 'topTenBigrams',
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
