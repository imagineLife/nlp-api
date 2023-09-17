let stateObj = {
  themeMaps: {},
  Collections: {
    Speeches: null
  }
}

function speeches() { 
  return stateObj.Collections?.Speeches.collection
}

export { stateObj, speeches };