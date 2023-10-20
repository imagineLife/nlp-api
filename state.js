// hmm
const speechesFields = new Map();
speechesFields.set("text", true);
speechesFields.set("author", true);
speechesFields.set("date", true);

let stateObj = {
  themeMaps: {},
  Collections: {},
  fields: {
    speechFields: speechesFields,
  },
};

function get(collectionName) {
  if (collectionName !== "Users")
    return stateObj.Collections?.[`${collectionName}`]?.collection;
  return stateObj.Collections.Users;
}

export { stateObj, get };
