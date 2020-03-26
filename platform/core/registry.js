const util = require('../util');
const { UnregisteredPath } = require('./errors');
const { Subscribable } = require('./base/subscribable');


const RegistryEvents = {
  registered: 'registered',
  instantiated: 'instantiated',
  aliased: 'aliased',
  mocked: 'mocked',
  unmocked: 'unmocked',
}

class Registry extends Subscribable {
  constructor() {
    super();
    this._mocks = {};
    this._paths = {};
    this._aliases = {};
  }

  register(signature, factoryOrClass) {
    if (signature.path) {
      let entry = {
        signature: signature,
        factoryOrClass: factoryOrClass,
      };

      signature.path = signature.path.endsWith('/') ?
          signature.path.substr(0, signature.path.length - 1) :
          signature.path; // make sure the key is consistant

      let method = 'get';
      if('method' in signature) method = signature.method.toLowerCase();

      if( ! (signature.path in this._paths) ) {
        this._paths[signature.path] = {};
      }

      this._paths[signature.path][method] = entry;
      
      this.publish(RegistryEvents.registered, entry);

      if (signature.path in this._aliases)
        delete this._aliases[signature.path];

      if (signature.path.endsWith('/'))
        this.alias(signature.path.substr(0, signature.path.length - 1), signature.path);
      else
        this.alias(signature.path + '/', signature.path);
    }

    return this;
  }

  signature(path, method = 'get') {
    if(method === '') {
      method = this.resolveDefaultMethod(path);
    }

    method = method.toLowerCase();
    let resolved = this.registered(path, method);
    
    if (resolved)
      return this._paths[resolved][method].signature;

    throw new UnregisteredPath(path);
  }

  instance(path, method = 'get') {
    if(method === '') {
      method = this.resolveDefaultMethod(path);
    }

    method = method.toLowerCase();

    let resolved = this.resolve(path);

    if (this.mocked(path, method)) {
      let instantiated = util.buildFromFactoryOrClass(this._mocks[resolved][method]);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    let resolvedIndex = this.registered(path, method);
    if (resolvedIndex) {
      let instantiated = util.buildFromFactoryOrClass(this._paths[resolved][method].factoryOrClass);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }
    
    throw new UnregisteredPath(path);
  }

  resolveDefaultMethod(path) {
    let resolved = this.resolve(path);
    
    if(resolved in this._paths)
      return Object.keys(this._paths[resolved])[0];

    return false;
  }

  registered(path, method = 'get') {
    method = method.toLowerCase();
    let resolved = this.resolve(path);
    
    if(
      (resolved in this._paths) &&
      (method in this._paths[resolved])
    ) return resolved;

    return false;
  }

  resolve(path) {
    if (path in this._aliases) {
      return this.resolve(this._aliases[path]);
    }

    return path;
  }

  alias(alias, path) {
    this._aliases[alias] = path;
    this.publish(RegistryEvents.aliased, {
      alias: alias,
      original: path,
    });

    return this;
  }

  mock(path, factoryOrClass, method = 'get') {
    method = method.toLowerCase();

    if( ! (path in this._mocks) ) {
      this._mocks[path] = {};
    }
    this._mocks[path][method] = factoryOrClass;

    this.publish(RegistryEvents.mocked, {
      path: path,
      factoryOrClass: factoryOrClass,
    });
  }

  unmock(path, method = 'get') {
    method = method.toLowerCase();
    
    delete this._mocks[path][method];

    if(Object.keys(this._mocks[path]).length === 0) {
      delete this._mocks[path];
    }

    this.publish(RegistryEvents.unmocked, path);
  }

  mocked(path, method = 'get') {
    method = method.toLowerCase();
    return this.resolve(path) in this._mocks;
  }

  get registrants() {
    let all = Object.assign({}, this._paths);
    
    for (let alias of Object.keys(this._aliases)) {
      let resolved = this.resolve(alias);
      if (resolved in this._paths) {
        all[alias] = {};

        for(let method in this._paths[resolved]) {
          let _obj = Object.assign({}, this._paths[resolved][method]);
          _obj.signature = Object.assign({}, _obj.signature, {
            path: alias,
            resolvedPath : resolved,
          });
          all[alias][method] = _obj;
        }
      }
    }
    
    return all;
  }
}

//
// basically, if there is already a registry defined,
// we should not be redifining it, but rather refering
// to the same registry. this specifically happens when
// dependent packages have mismatching platform version
// from installed platform version.
//
if (!global.connect_platform_registry)
  global.connect_platform_registry = new Registry();

module.exports = global.connect_platform_registry;
module.exports.events = RegistryEvents;
