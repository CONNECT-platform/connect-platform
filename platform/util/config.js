const deepAssign = (sourceDict, newDict) => {
  for (let [key, newVal] of Object.entries(newDict)) {
    if (key in sourceDict) {
      let sourceVal = sourceDict[key];

      if (sourceVal instanceof Array) {
        sourceDict[key] = Array.from(new Set(sourceVal.concat(newVal)));
      }
      else if (sourceVal.constructor === Object) {
        deepAssign(sourceVal, newVal);
      }
      else sourceDict[key] = newVal;
    }
    else sourceDict[key] = newVal;
  }
}

class Configuration {
  constructor(initial) {
    this._params = initial || {};
  }

  append(params) {
    deepAssign(this._params, params);
    return this;
  }

  get(key) {
    if (this.has(key))
      return this._params[key].valueOf();

    return undefined;
  }

  has(key) {
    return key in this._params;
  }
}

module.exports = (initial) => new Configuration(initial);
