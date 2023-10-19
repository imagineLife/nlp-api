// hmm
const speechesFields = new Map();
speechesFields.set('text', true);
speechesFields.set('author', true);
speechesFields.set('date', true);

let stateObj = {
  themeMaps: {},
  Collections: {
    Speeches: null
  },
  fields: {
    speechFields: speechesFields
  }
}

function get(collectionName) { 
  return stateObj.Collections?.[`${collectionName}`]?.collection;
}

export { stateObj, get };