import supertest from 'supertest';
import { expressSetup } from './../../setup/index.js';
const LIVENESS_URL = '/healthz/liveness'
const READINESS_URL = '/healthz/readiness';
describe('GET /healthz', () => {
  let app;
  beforeAll(() => { 
    app = expressSetup();
  })
  afterAll(() => { 
    console.log('closing app')
    
    app.close();
  })
  it(`${LIVENESS_URL} returns a 200 with text "OK"`, async () => {
    const { statusCode, text } = await supertest(app).get(LIVENESS_URL);
    expect(statusCode).toBe(200);
    expect(text).toBe('OK');
  });
  it(`${READINESS_URL} returns a 200 with body status and fields`, async () => {
    const { statusCode, body: { status, timestamp } } = await supertest(app).get(READINESS_URL);
    expect(statusCode).toBe(200);
    expect(status).toBe('OK');
    expect(typeof timestamp).toBe('string')
  });
})