import { jest } from '@jest/globals';
import { setupTestDB } from './db.js';
import { DB } from './../lib/models/db/index.js';
import { Crud } from './../lib/models/crud/index.js';
// jest.mock('./../lib/models/db/index.js', () => {
//   const originalModule = jest.requireActual('./../lib/models/db/index.js');

//   return {
//     __esModule: true,
//     ...originalModule,
//   };
// });

// jest.mock('./../lib/models/db/index.js');

describe('setupTestDB', () => {
  const COLL_NAME = 'TestUsers';
  const DB_NAME = 'TestNlpDb';
  const dbObj = {
    host: 'localhost',
    port: '27017',
  };
  let testedDb;
  beforeAll(async () => {
    process.env.MONGO_AUTH = false;
  });
  afterAll(async () => { 
    await testedDb.close()
  })
  it('calls DB.connect method', async () => {
    const connectSpy = jest
      .spyOn(DB.prototype, 'connect')
    testedDb = await setupTestDB({ ...dbObj });
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});

// describe('registerDbCollections', () => { 
//   const fn1 = jest.fn()
//   const mockParam = {
//     registerDB: fn1,
//   }
// });
