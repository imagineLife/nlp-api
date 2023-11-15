import supertest from 'supertest';
import { expressSetup, registerDbCollections } from './../../../../setup/index.js';
import setupTestDB from './../../../../lib/config/setupTestDb.js';

const USER_EMAIL_URL = '/api/users/email';
const REGISTER_URL = '/api/users/register';
describe(`POST ${USER_EMAIL_URL}`, () => {
  let app, dbClient;
  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);
  });

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  it('After Registering, will succeed', async () => {
    //
    // register
    //
    const email = 'almostDone@email.com';
    const pw = 'testPw';
    const { statusCode: registerStatus } = await supertest(app).post(REGISTER_URL).send({ email });
    expect(registerStatus).toBe(200);

    const { statusCode: doneStatus } = await supertest(app)
      .post(REGISTER_URL)
      .send({ email, password: pw });
    expect(doneStatus).toBe(200);

    const { statusCode } = await supertest(app).post(USER_EMAIL_URL).send({ email });
    expect(statusCode).toBe(200);
  });
});
