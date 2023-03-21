import { DB } from './../lib/models/db/index.js';

/*
  - takes a db name (string)
    - builds Mongo Client
    - connects mongo client
  - returns the db object
*/
async function setupDB(params) {
  try {
    // Connect
    const MongoClient = new DB({
      connectionObj: {
        username: process.env.MONGO_DB_USER,
        pw: process.env.MONGO_DB_PW,
        host: params.host,
        port: params.port,
        authDB: process.env.MONGO_DB_AUTH_DB,
      },
    });
    await MongoClient.connect();
    return MongoClient;
  } catch (e) {
    return null;
  }
}

async function setupTestDB(params) {
  try {
    // Connect
    const MongoClient = new DB({
      connectionObj: {
        host: params.host,
        port: params.port,
      },
    });
    await MongoClient.connect();
    return MongoClient;
  } catch (e) {
    return null;
  }
}

export default setupDB;
export { setupTestDB };
