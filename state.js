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

function speeches() { 
  return stateObj.Collections?.Speeches.collection
}

export { stateObj, speeches };