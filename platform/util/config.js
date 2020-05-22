const deepAssign = (sourceDict, newDict) => {
  for (let [key, newVal] of Object.entries(newDict)) {
    if (key in sourceDict) {
      let sourceVal = sourceDict[key];

      if (sourceVal instanceof Array) {
        if (!newVal instanceof Array) newVal = [newVal];
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

  get(key, _default) {
    if (this.has(key))
      return this._params[key].valueOf();

    return _default;
  }

  has(key) {
    return key in this._params;
  }

  setFromEnvVariable(path, varName, verbose = false) {
    const value = process.env[varName];
    if(value) {
      if(verbose) console.log(`Found / setting from environment variable ${varName} to ${path}`);
      const pathComponents = path.split('.');
  
      let ref = this._params;
      const nComponents = pathComponents.length - 1;
      for(let i = 0; i < pathComponents.length - 1; i++) {
        const pathComponent = pathComponents[i];
  
        if( ! (pathComponent in ref) ) {
          ref[pathComponent] = {};
        }
  
        ref = ref[pathComponent];
      }

      const lastPathComponent = pathComponents[nComponents];
      
      ref[lastPathComponent] = value;
    }
  }
  
  setServiceURLFromEnvVariable(name, varName, verbose = false) {
    const value = process.env[varName];
    if(value) {
      if(verbose) console.log(`Found / setting service URL ${name} from environment variable ${varName} = ${value}`);
      
      if(! ('nodes' in this._params) ) this._params.nodes = {};
      if(! ('service' in this._params.nodes) ) this._params.nodes.service = [];

      const services = this._params.nodes.service;
  
      let found = false;
      let i = 0;
      for(i = 0; i < services.length; i++) {
        if(name === services[i].name) {
          found = true;
          break;
        }
      }
  
      if(! found) {
        if(verbose) console.log(`Service ${name} was not found... Creating one with the spec`);
        services.push({
          name,
          url: value
        });
  
        return;
      }
  
      services[i].url = value;
    }
  }

  autoparseFromEnvironmentVars(debug = false) {
    this.recursiveParse(this._params, (object, item, path) => {
      const value = object[item];
      const reg = /{{\s*([^\s]+) (\|\|\s*([^\s])*)?\s*}}/g;
      let match = reg.exec(value);

      while(match && match.length > 1) {
        const stringMatch = match[0];
        const envVarName = match[1];

        let defaultValue = (match.length > 2 && match[2]) ? match[2] : null;
        match = reg.exec(value);

        if(envVarName === '' || ! process.env[envVarName]) {
          if(defaultValue !== null) {
            defaultValue = defaultValue.substring(2).trim();

            object[item] = object[item].replace(stringMatch, defaultValue);
          }
          continue;
        }
        
        object[item] = object[item].replace(stringMatch, process.env[envVarName]);
        if(debug) {
          console.log(`Setting environment variable ${envVarName} in ${path}`);
        }
      }
    });
  }

  recursiveParse(object, callback, path = "") {
    for(let item in object) {
      const newPath = `${path}${(path !== '') ? '.' : ''}${item}`;
      if( object[item] && (object[item] instanceof Object) ) {
        this.recursiveParse(object[item], callback, newPath);
      } else {
        callback(object, item, newPath);
      }
    }
  }

  get core() {
    return new Proxy({}, {
      get: (_, prop) => this.get(prop),
      has: (_, prop) => this.has(prop),
      set: () => {},
    });
  }
}

module.exports = (initial) => new Configuration(initial);
