// hmm
const speechesFields = new Map();
speechesFields.set('text', true);
speechesFields.set('author', true);
speechesFields.set('date', true);

let stateObj = {
  themeMaps: {},
  Collections: {},
  fields: {
    speechFields: speechesFields,
  },
};

function Users() {
  return stateObj.Collections.Users;
}

function get(collectionName) {
  if (collectionName == 'Users') return stateObj.Collections.Users;
  if (collectionName == 'Themes') return stateObj.Collections.Themes;
  return stateObj.Collections?.[`${collectionName}`]?.collection;
}

export { stateObj, get, Users };
