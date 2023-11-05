//
// GOALS:
// - read text files from a dir
// - parse custom-formatted file-names into: date + author
// - call an api & upload the text data with POST { date, author, text }
//

const { readdir, readFile } = require('fs');
const TEXT_FILE_DIR_PATH = './../../texts/';

//
// STATE
//
const filesToRead = [];

// NOTE: a security detail here
const setCookieHeader = '';
const API_HOST = 'localhost';
const API_PORT = '3000';
const API_PREFIX = `http://${API_HOST}:${API_PORT}`;
const API_URL = `${API_PREFIX}/api/speeches`;

//
// 0. START
//
readdir(TEXT_FILE_DIR_PATH, processDirectoryFiles);

//
// 1.processDirectoryFiles
//
function processDirectoryFiles(err, files) {
  if (err) throw new Error(err);
  //
  // loop through files
  //
  files.forEach((fileName, idx) => {
    if (startsWithZero(fileName)) {
      // ONLY 1 to start
      filesToRead.push(fileName);
    }
  });

  processFilesToRead();
}

//
// 2. processFilesToRead
//
function processFilesToRead() {
  printThisName(arguments);
  if (filesToRead.length < 1) {
    return 'DONE!';
  }
  console.log(`beginning to process ${thisFile}`);
  let thisFile = filesToRead.pop();
  const filePath = `${TEXT_FILE_DIR_PATH}/${thisFile}`;
  readFile(filePath, (err, fileContents) => {
    if (err) throw new Error(err);
    let stringVersion = fileContents.toString();
    const fileMetadata = speechInfoFromName(thisFile);
    sendToApi({
      text: stringVersion,
      ...fileMetadata,
    }).then(async (res) => {
      if (res?.status === 200) {
        processFilesToRead();
      }
    });
  });
}

//
// 3. send to api
//
async function sendToApi(data) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      Cookie: setCookieHeader,
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

//
// ... other fns below
//
function printThisName(args) {
  var myName = args.callee.toString();
  myName = myName.substr('function '.length);
  myName = myName.substr(0, myName.indexOf('('));
  console.log(`functionName: ${myName}`);
}

function startsWithZero(str) {
  return str[0] === '0';
}

function speechInfoFromName(s) {
  let split = s.split('_');
  let date = split[0];
  let month = date.slice(0, 2);
  let day = date.slice(2, 4);
  let yr = date.slice(4, 8);
  let formattedDate = `${month}-${day}-${yr}`;

  let speaker = `${split[1]} ${split[2].split('.')[0]}`;
  return {
    date: formattedDate,
    author: speaker,
  };
}
