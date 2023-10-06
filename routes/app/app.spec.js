import { jest } from '@jest/globals';
import assureAllowed from './assureAllowed.js';
import allowAccessHandler, { MISSING_DATA_ERR, NO_APP_REGISTERED_ERR, APP_REG_EXP_ERR } from "./allowAccess.js";
import { stateObj } from '../../state.js';
import getHandler from './get.js'
describe('assureAllowed', () => {
  const throws = [
    {
      in: {
        hostname: 'fail',
        allowedHost: 'fail2',
      },
    },
    {
      in: {
        query: {
          id: 'fail',
        },
        allowedQuery: {
          id: 'fail2',
        },
      },
    },
  ];
  const passes = [
    {
      in: {
        hostname: 'pass',
        allowedHost: 'pass',
        query: {
          id: 'pass',
        },
        allowedQuery: {
          id: 'pass',
        },
      },
    },
    {
      in: {
        query: {
          id: 'pass',
        },
        allowedQuery: {
          id: 'pass',
        },
      },
    },
  ];

  throws.forEach(({ in: testInput }) => {
    it(`throws from input ${JSON.stringify(testInput)}`, () => {
      expect(() => {
        assureAllowed({ ...testInput });
      }).toThrow('not allowed fool!');
    });
  });
  passes.forEach(({ in: testInput }) => {
    it(`passes from input ${JSON.stringify(testInput)}`, () => {
      expect(assureAllowed({ ...testInput })).toBe(true);
    });
  });
});

describe('allowAccessHandler', () => {
  const EXPIRED_APP_ID = 'expired-app';
  const NON_EXPIRED_APP_ID = 'g2g-app';
  beforeAll(() => {
    let expDate = new Date();
    let forwardDate = new Date();
    const pastDate = expDate.getDate() - 7;
    const futureDate = forwardDate.getDate() + 100;
    expDate.setDate(pastDate);
    forwardDate.setDate(futureDate)
    stateObj[`${EXPIRED_APP_ID}`] = expDate;
    stateObj[`${NON_EXPIRED_APP_ID}`] = forwardDate;
  })
  afterAll(() => { 
    delete stateObj[`${EXPIRED_APP_ID}`];
    delete stateObj[`${NON_EXPIRED_APP_ID}`];
  })
  it('returns ERR: missing data', () => {
    const mockJsonFn = jest.fn();
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    const res = allowAccessHandler({}, mockRes);
    expect(mockJsonFn).toHaveBeenCalledWith({ Error: MISSING_DATA_ERR });
  })
  it('returns ERR: no app registered (by default)', () => {
    const mockJsonFn = jest.fn();
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    allowAccessHandler({
      query: {
        id: 'not-there'
      }
    }, mockRes);
    expect(mockJsonFn).toHaveBeenCalledWith({ Error: NO_APP_REGISTERED_ERR });
  });
  it('returns ERR: expired app', () => {
    const mockJsonFn = jest.fn();
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
      }),
    };
    allowAccessHandler(
      {
        query: {
          id: EXPIRED_APP_ID,
        },
      },
      mockRes
    );
    expect(mockJsonFn).toHaveBeenCalledWith({ Error: APP_REG_EXP_ERR });
  });
  it('succeeds when expired date is 1 week forward', () => {
    const mockJsonFn = jest.fn();
    const mockTwo = jest.fn()
    const mockRes = {
      status: () => ({
        json: mockJsonFn,
        send: mockTwo,
      }),
    };
    allowAccessHandler(
      {
        query: {
          id: NON_EXPIRED_APP_ID,
        },
      },
      mockRes
    );
    expect(mockTwo).toHaveBeenCalledWith({ appId: NON_EXPIRED_APP_ID });
  });
});

describe('get', () => { 
  const HOST_PROCESS_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...HOST_PROCESS_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = HOST_PROCESS_ENV; // Restore old environment
  });

  it('gets an appId & validates the app is in stateObj', () => {
    process.env.ALLOWED_HOST = 'test-host';
    process.env.ALLOWED_QUERY = 'testquery';
    const mockJsonFn = jest.fn()
    const mockReq = {
      hostname: 'test-host',
      query: { id: 'testquery' },
    };
    const mockRes = {
      status: () => ({
        json: mockJsonFn
      }),
    };

    getHandler(mockReq, mockRes);
    const { mock: { calls: [ [mockFnArg] ] } } = mockJsonFn;
    expect(Object.keys(mockFnArg)[0]).toBe('id');
    expect(typeof mockFnArg.id).toBe('string');
  })
})