import { jest } from '@jest/globals';
import supertest from 'supertest';
import { expressSetup } from './../../../setup/index.js';
import { registerDbCollections } from './../../../setup/db.js';
import setupTestDB from './../../../lib/config/setupTestDb.js';
import { failOnUnwatendFields } from './middleware.js';
// import * as stateMod from './../../../state.js';

const mockSpeechesFn = jest.fn()
const mockPostSpeechId = '8675309'

describe('speeches', () => {
  const SPEECHES_URL = '/api/speeches';
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
  });

  afterEach(() => {
    jest.resetModules();
  })

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.close();
  });

  it('GET returns a 200', async () => {
    const { statusCode, body } = await supertest(app).get(SPEECHES_URL);
    expect(statusCode).toBe(200);
  });
  
  it('POST fail: returns a 422 with expected body.Error text', async () => {
    const stateModule = await import('./../../../state.js');
    const { statusCode, body } = await supertest(app).post(SPEECHES_URL).send({
      text: 'this is a test',
      author: 'test author',
    });
    expect(statusCode).toBe(422);
    expect(body.Error).toBe('missing required params');
  });

  it('POST fail: returns a 500 when module throws', async () => {
    jest.unstable_mockModule('./../../../state.js', () => ({
      speeches: () => ({
        insertOne: mockSpeechesFn.mockRejectedValueOnce({ message: 'mock thrown' }),
      }),
    }));
    const stateModule = await import('./../../../state.js');
    const { statusCode, body, ...rest } = await supertest(app).post(SPEECHES_URL).send({
      text: 'this is a test',
      author: 'test author',
      date: '01-01-2023',
    });
    expect(statusCode).toBe(500);
    expect(body.Error).toBe('mock thrown')
  });

  it('POST success: returns a 200 with location header, calls "runAnalytics fn"', async () => {
      const mockRunAnaytics = jest.fn()
      // mock modules
      // STATE
      jest.unstable_mockModule('./../../../state.js', async () => ({
        speeches: () => ({
          insertOne: mockSpeechesFn.mockImplementation(() => ({ insertedId: mockPostSpeechId })),
        }),
        stateObj: {},
      }));
      // ANALYTICS
      jest.unstable_mockModule('./../../../lib/index.js', async () => ({
        runAnalytics: mockRunAnaytics,
      }));


      const stateModule = await import('./../../../state.js');
      const { statusCode, headers } = await supertest(app).post(SPEECHES_URL).send({
        text: 'this is a test',
        author: 'test author',
        date: '01-01-2023',
      });
      expect(statusCode).toBe(200);
      expect(headers.location.includes(`/speeches/${mockPostSpeechId}`)).toBe(true);
    expect(mockSpeechesFn).toHaveBeenCalled();
    expect(mockRunAnaytics).toHaveBeenCalledTimes(1);
    expect(mockRunAnaytics).toHaveBeenCalledWith(mockPostSpeechId);
    });
});

describe('speeches middleware', () => {
  const mockNext = jest.fn();
  const mockRes = {
    status: () => ({
      json: mockJsonFn,
    }),
  };

  let badReq = {
    body: {
      nogood: 'shouldFail',
    },
  };

  let goodReq = {
    body: {
      text: 'shouldPass',
      author: 'passing',
      date: 'qwer'
    },
  };

  it('fails with bady req body key', () => {
    expect(() => {
      failOnUnwatendFields(badReq, mockRes, mockNext);
    }).toThrow();
  })
  it('success: calls res.status.json', () => {
    failOnUnwatendFields(goodReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(1)
  });
});
