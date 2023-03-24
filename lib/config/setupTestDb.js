import { setupTestDB } from './../../setup/db.js'
import { Crud } from './../models/crud/index.js';

async function setupTestDb() {
  const DB_NAME = 'TestDB';
  const COLL_NAME = 'TestCollection';
  const dbObj = {
    host: 'localhost',
    port: '27017',
  };

  process.env.MONGO_AUTH = false;
  const TestMongoClient = await setupTestDB({ ...dbObj });
  const TestSayWhat = TestMongoClient.registerDB(DB_NAME);
  const ThisCrud = new Crud({ db: TestSayWhat, collection: COLL_NAME });
  return {
    Collection: ThisCrud,
    MongoClient: TestMongoClient,
  };
}

export default setupTestDb;
