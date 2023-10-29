import { jest } from '@jest/globals';

import requireRegisteredApp from './requireRegisteredApp.js';
describe('requireRegisteredApp', () => {
  const HOST_PROCESS_ENV = process.env;

  beforeEach(() => {
    process.env = { ...HOST_PROCESS_ENV }; // Make a copy
  });

  it('calls "next" when in test env', () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    requireRegisteredApp(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
  it('returns 500 when no session.appId', () => {
    process.env.NODE_ENV = 'development';
    const mockJsonFn = jest.fn();
    const mockReq = {};
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    const mockNext = jest.fn();
    requireRegisteredApp(mockReq, mockRes, mockNext);
    expect(mockJsonFn).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenCalledWith({ Error: 'Access Not Allowed' });
    process.env.NODE_ENV = 'test';
  });
  it('calls next when session.appId', () => {
    process.env.NODE_ENV = 'development';
    const mockJsonFn = jest.fn();
    const mockReq = {
      session: {
        appId: 'mock-here',
      },
    };
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    const mockNext = jest.fn();
    requireRegisteredApp(mockReq, mockRes, mockNext);
    expect(mockJsonFn).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledTimes(1);
    process.env.NODE_ENV = 'test';
  });
});
