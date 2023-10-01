import supertest from 'supertest';
import { expressSetup, serverKiller } from './../../setup/index.js';
const LIVENESS_URL = '/healthz/liveness'
describe('GET /healthz', () => {
  let app;
  beforeAll(() => { 
    app = expressSetup();
  })
  afterAll(() => { 
    console.log('closing app')
    
    app.close();
  })
  it(LIVENESS_URL, async () => {
    const { statusCode, text } = await supertest(app).get(LIVENESS_URL);
    expect(statusCode).toBe(200);
    expect(text).toBe('OK');
  });
})