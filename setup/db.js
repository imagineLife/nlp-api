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
