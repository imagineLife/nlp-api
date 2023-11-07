//
// GOALS:
//
console.time('wholeFile');
const ANALYSIS_TO_APPLY = process.argv[2];
if (!ANALYSIS_TO_APPLY) throw new Error('third arg must be a valid analysis to run on each speech');

//
// STATE
//
let speechIds = [];

// NOTE: a security detail here
// const setCookieHeader = '';
const API_HOST = 'localhost';
const API_PORT = '3000';
const API_PREFIX = `http://${API_HOST}:${API_PORT}`;
const GET_SPEECHES_URL = `${API_PREFIX}/api/speeches`;
const urlFn = (speechId) =>
  `${API_PREFIX}/api/speeches/${speechId}/analytics/${ANALYSIS_TO_APPLY}/run`;

//
// 1. get speeches + "pull" speechId out
//

fetch(GET_SPEECHES_URL)
  .then(processSpeeches)
  .catch((e) => {
    console.log('get speeches error:');

    console.log(e);
  });

//
// 2. fetch handler
//
async function processSpeeches(res) {
  let jsonRes = await res.json();
  console.log(`got ${jsonRes.length} speeches`);
  jsonRes.forEach((s) => speechIds.push(s._id));
  applyAnalysisToSpeeches();
}

//
// 3
//
function applyAnalysisToSpeeches() {
  let speechId = speechIds.shift();
  if (!speechId) {
    console.log('DONE!');
    console.timeEnd('wholeFile');
    return;
  }
  console.log(`applying analytics to ${speechId}`);

  let postUrl = urlFn(speechId);
  fetch(postUrl)
    .then(validatePostRes)
    .catch((e) => {
      console.log(`POST ERROR on ${postUrl}:`);
      console.log(e);
    });
}

//
// 4
//
async function validatePostRes(res) {
  if (res?.status !== 200) {
    console.log('HUH?!');
  } else {
    applyAnalysisToSpeeches();
  }
}
