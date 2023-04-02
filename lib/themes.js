import { stateObj } from "../state.js";
/*
  THEMES
  - money
*/
const moneyMap = new Map();
const moneyWords = ['pay', 'compensation', 'income', 'paycheck'];

const satisfiedMap = new Map();
const satisfiedWords = ['happy', 'satisfied', 'pleased', 'enjoy'];

// const dissatisfiedMap = new Map();
// const dissatisfiedWords = ['bored', 'angry', 'hate', 'lost', 'stupid', 'boring', 'bored'];

const communicationMap = new Map();
const communicationWords = ['talk', 'communicate', 'meetings', 'hear', 'listen', 'heard'];

const timeMap = new Map();
const timeWords = [
  'today',
  'day',
  'yesterday',
  'past',
  'future',
  'history',
  'ages',
  'hour',
  'days',
  'centuries',
  'ahead',
  'predecessors',
  'lifetime',
  'forward',
  'backward',
  'year',
  'deferred',
  'tomorrow',
  'ever',
  'time',
  'early',
];

const govtMap = new Map();
const govtWords = ['democracy', 'america', 'capitol', 'nation', 'constitution', 'president', 'systemic'];

const hopeMap = new Map()
const hopeWords = ['hope', 'renewal', 'prevailed', 'change', 'restore', 'heal']; //'resolve'

const powerMap = new Map()
const powerWords = ['risen', 'challenge', 'fragile', 'strength', 'oath', 'justice', 'overcome'];

const communityMap = new Map()
const communityWords = [
  'people',
  'we',
  'us',
  'our',
  'friends',
  'together',
  'heart',
  'resilience',
  'unity',
];

const negativeMap = new Map()
const negativeWords = [
  'grim',
  'violence',
  'storm',
  'war',
  'peril',
  'difficult',
  'virus',
  'lost',
  'survival',
  'desperate',
  'terrorism',
  'battle',
  'worry',
  'crisis',
  // taken from dissatisfied
  'bored', 'angry', 'hate', 'lost', 'stupid', 'boring', 'bored'
];


/*
themes
government
hope
economy
change
patriotism
community
unity
power
*/

const mapArr = [
  {
    name: 'money',
    map: moneyMap,
    wordList: moneyWords,
  },
  {
    name: 'satisfaction',
    map: satisfiedMap,
    wordList: satisfiedWords,
  },
  // {
  //   name: 'dissatistfied',
  //   map: dissatisfiedMap,
  //   wordList: dissatisfiedWords,
  // },
  {
    name: 'communication',
    map: communicationMap,
    wordList: communicationWords,
  },
  {
    name: 'time',
    map: timeMap,
    wordList: timeWords,
  },
  {
    name: 'government',
    map: govtMap,
    wordList: govtWords,
  },
  {
    name: 'hope',
    map: hopeMap,
    wordList: hopeWords,
  },
  {
    name: 'power',
    map: powerMap,
    wordList: powerWords,
  },
  {
    name: 'community',
    map: communityMap,
    wordList: communityWords,
  },
  {
    name: 'negativity',
    map: negativeMap,
    wordList: negativeWords,
  },
];


function buildThemes() {
  mapArr.forEach((obj) => {
    // put words in map
    obj.wordList.forEach((word) => {
      obj.map.set(word);
    });

    // store map in state
    stateObj.maps[`${obj.name}`] = obj.map;
  });
  console.log('THEMES: Setup Complete')
  
}

export { buildThemes }
