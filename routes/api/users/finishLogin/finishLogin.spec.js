import supertest from 'supertest';
import { expressSetup, registerDbCollections } from './../../../../setup/index.js';
import setupTestDB from './../../../../lib/config/setupTestDb.js';

const USER_EMAIL_URL = '/api/users/email';
const USER_PW_URL = '/api/users/pw';
const REGISTER_URL = '/api/users/register';
describe(`POST ${USER_EMAIL_URL}`, () => {
  let app, dbClient;
  const email = 'almostDone@email.com';
  const password = 'testPw';

  beforeAll(async () => {
    app = expressSetup();
    const { MongoClient } = await setupTestDB();
    dbClient = MongoClient;
    registerDbCollections(dbClient, true);

    //
    // register
    //
    const { statusCode: registerStatus } = await supertest(app).post(REGISTER_URL).send({ email });
    expect(registerStatus).toBe(200);

    const { statusCode: doneStatus } = await supertest(app)
      .post(REGISTER_URL)
      .send({ email, password });
    expect(doneStatus).toBe(200);
  });

  afterAll(async () => {
    console.log('closing app');
    await app.close();
    await dbClient.dropDatabase();
    await dbClient.close();
  });

  it('After Registering, AND after email, will succeed', async () => {
    // POST user/email
    const { statusCode: emailStatus, headers } = await supertest(app)
      .post(USER_EMAIL_URL)
      .send({ email });
    expect(emailStatus).toBe(200);

    const responseCookie = headers['set-cookie'][0].split('=');
    let cookiename = responseCookie.shift();

    // POST user/password
    const { statusCode } = await supertest(app)
      .post(USER_PW_URL)
      .set('Cookie', `${cookiename}=${responseCookie.join('=')};`)
      .send({ email, password });
    expect(statusCode).toBe(200);
  });

  it('gets a 422 without an expected session', async () => {
    // POST user/email
    const { statusCode: emailStatus, headers } = await supertest(app)
      .post(USER_EMAIL_URL)
      .send({ email });
    expect(emailStatus).toBe(200);

    const responseCookie = headers['set-cookie'][0].split('=');
    let cookiename = responseCookie.shift();

    // POST user/password
    const { statusCode, body } = await supertest(app).post(USER_PW_URL).send({ email, password });
    expect(statusCode).toBe(422);
    expect(body).toEqual({ Error: 'try logging in again' });
  });

  it('gets a 422 when email does not match session', async () => {
    // POST user/email
    const { statusCode: emailStatus, headers } = await supertest(app)
      .post(USER_EMAIL_URL)
      .send({ email });
    expect(emailStatus).toBe(200);

    const responseCookie = headers['set-cookie'][0].split('=');
    let cookiename = responseCookie.shift();

    // POST user/password
    const { statusCode, body } = await supertest(app)
      .post(USER_PW_URL)
      .send({ email: 'different@email.com', password })
      .set('Cookie', `${cookiename}=${responseCookie.join('=')};`);
    expect(statusCode).toBe(422);
    expect(body).toEqual({ Error: 'bad email' });
  });

  it('gets a 422 when pw does not match session', async () => {
    // POST user/email
    const { statusCode: emailStatus, headers } = await supertest(app)
      .post(USER_EMAIL_URL)
      .send({ email });
    expect(emailStatus).toBe(200);

    const responseCookie = headers['set-cookie'][0].split('=');
    let cookiename = responseCookie.shift();

    // POST user/password
    const { statusCode, body } = await supertest(app)
      .post(USER_PW_URL)
      .send({ email, password: 'different-pw' })
      .set('Cookie', `${cookiename}=${responseCookie.join('=')};`);
    expect(statusCode).toBe(422);
    expect(body).toEqual({ Error: 'bad password' });
  });
});
