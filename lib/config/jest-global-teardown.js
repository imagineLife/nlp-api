import setupTestDb from './setupTestDb.js'
export default async function jestGlobalTeardown(globalConfig, projectConfig) {
  let { MongoClient} = await setupTestDb()
  await MongoClient.dropDatabase();
  await MongoClient.close()
  console.log('jest global teardown done')
}