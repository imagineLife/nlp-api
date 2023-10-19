import { jest } from '@jest/globals';
import supertest from 'supertest';
import { expressSetup } from './../../../setup/index.js';
import { registerDbCollections } from './../../../setup/db.js';
import setupTestDb from './../../../lib/config/setupTestDb.js';

describe('users', () => {
  const USERS_URL = '/api/users';
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDb();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
  });

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  it('GET returns a 200', async () => {
    const { statusCode } = await supertest(app).get(USERS_URL);
    expect(statusCode).toBe(200);
  });

  it('POST fail: returns a 422 with expected body.Error text', async () => {
    const { statusCode, body } = await supertest(app).post(USERS_URL).send({
      email: "horse@dog.com"
    });
    expect(statusCode).toBe(422);
    expect(body.Error).toBe('missing required params');
  });

  it('POST succeeds: status 200 + location header', async () => {
    const test_email = 'horse@dog.com'
    const {
      statusCode,
      headers: { location },
    } = await supertest(app).post(USERS_URL).send({
      email: test_email,
      firstName: 'test',
      lastName: 'test',
    });
    
    console.log('location')
    console.log(location)
    
    expect(statusCode).toBe(200);
    expect(location.includes(test_email)).toBe(true)
  });
});
