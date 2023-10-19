import { DB } from './../lib/models/db/index.js';
import { Crud } from './../lib/models/crud/index.js'
import { UserAuth } from './../lib/models/userAuth/index.js';
import { stateObj } from './../state.js';
/*
  - takes {host: string, port: number}
*/
async function setupDB(params) {
  try {
    // Connect
    const MongoClient = new DB({
      connectionObj: {
        username: process.env.MONGO_DB_USER,
        pw: process.env.MONGO_DB_PW,
        host: params?.host || process.env.MONGO_DB_HOST,
        port: params?.port || process.env.MONGO_DB_PORT,
        authDB: process.env.MONGO_DB_AUTH_DB,
      },
    });
    await MongoClient.connect();
    return MongoClient;
  } catch (e) {
    console.log('setupDB Error: ', e.message);
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

function registerDbCollections(DbObj, testRegistration) {
  let dbName = testRegistration ? 'TestNlp' : 'Nlp'
  const NlpDb = DbObj.registerDB(dbName);
  const collections = ['Speeches', 'Themes'];

  stateObj.Collections.Users = new UserAuth({
    db: NlpDb,
    collection: 'Users',
  });

  collections.forEach(collection => {
    const ThisCollection = new Crud({
      db: NlpDb,
      collection,
    });
    stateObj.Collections[`${collection}`] = ThisCollection;
  })
  console.log(`DB: Collections setup in db ${dbName}`);
}

export default setupDB;
export { setupTestDB, registerDbCollections };
