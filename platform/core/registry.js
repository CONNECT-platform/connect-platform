const util = require('../util');
const { UnregisteredPath } = require('./errors');
const { Subscribable } = require('./base/subscribable');
const hash = require('../util/hash');

const RegistryEvents = {
  registered: 'registered',
  registered: 'deregistered',
  instantiated: 'instantiated',
  aliased: 'aliased',
  dealiased: 'dealiased',
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

  reset() {
    this.resetMocks();
    this.resetPaths();
    this.resetAliases();
  }

  resetMocks() {
    for(let path in this._mocks) {
      for(let key in this._mocks[path]) {
        this.unmock(path, key);
      }
    }
  }

  resetPaths() {
    for(let path in this._paths) {
      for(let key in this._paths[path]) {
        this.deregister(path, key);
      }
    }
  }

  resetAliases() {
    for(let alias in this._aliases) {
      this.dealias(alias);
    }
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

      let key = null;
      if('method' in signature) signature.method = signature.method.toLowerCase();
      if('key' in signature) key = signature.key;
      else key = hash.hashSig(signature);

      if( ! (signature.path in this._paths) ) {
        this._paths[signature.path] = {};
      }

      this._paths[signature.path][key] = entry;
      
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

  deregister(path, key) {
    const signature = this._paths[path][key];
    delete this._paths[path][key];

    if(Object.keys(this._paths[path]).length === 0) {
      delete this._paths[path];
    }

    this.publish(RegistryEvents.deregistered, signature);
  }

  signature(path, key) {
    key = this.keyIfNotSet(key, { path });

    if(! this.registered(path, key)) {
      throw new UnregisteredPath(path);
    }

    let resolved = this.resolve(path);
    
    return this._paths[resolved][key].signature;
  }

  instance(path, key) {
    let resolved = this.resolve(path);

    key = this.keyIfNotSet(key, { path: resolved });

    if (this.mocked(path, key)) {
      let instantiated = util.buildFromFactoryOrClass(this._mocks[resolved][key]);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    if(! this.registered(path, key)) {
      throw new UnregisteredPath(path);
    }

    let resolvedIndex = this.resolve(path);
    
    let instantiated = util.buildFromFactoryOrClass(this._paths[resolved][key].factoryOrClass);
    this.publish(RegistryEvents.instantiated, instantiated);
    return instantiated;
  }

  resolveDefaultKey(path) {
    let resolved = this.resolve(path);
    
    if(resolved in this._paths)
      return Object.keys(this._paths[resolved])[0];

    throw new UnregisteredPath(path);
  }

  keyIfNotSet(key, signature) {
    if(key === undefined) {
      key = hash.hashSig(signature);
    }

    return key;
  }

  registered(path, key) {
    key = this.keyIfNotSet(key, { path });

    let resolved = this.resolve(path);
    
    if(
      (resolved in this._paths) &&
      (key in this._paths[resolved])
    ) {
      return true;
    }

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

  dealias(alias) {
    const path = this._aliases[alias];
    delete this._aliases[alias];
    this.publish(RegistryEvents.dealiased, {
      alias: alias,
      original: path,
    });
  }

  mock(path, factoryOrClass, key) {
    key = this.keyIfNotSet(key, { path });

    if( ! (path in this._mocks) ) {
      this._mocks[path] = {};
    }
    this._mocks[path][key] = factoryOrClass;

    this.publish(RegistryEvents.mocked, {
      path: path,
      factoryOrClass: factoryOrClass,
    });
  }

  unmock(path, key) {
    key = this.keyIfNotSet(key, { path });

    delete this._mocks[path][key];

    if(Object.keys(this._mocks[path]).length === 0) {
      delete this._mocks[path];
    }

    this.publish(RegistryEvents.unmocked, path);
  }

  mocked(path, methkeyod = 'get') {
    return this.resolve(path) in this._mocks;
  }

  get registrants() {
    let all = Object.assign({}, this._paths);
    
    for (let alias of Object.keys(this._aliases)) {
      let resolved = this.resolve(alias);
      if (resolved in this._paths) {
        all[alias] = {};

        for(let key in this._paths[resolved]) {
          let _obj = Object.assign({}, this._paths[resolved][key]);
          _obj.signature = Object.assign({}, _obj.signature, {
            path: alias,
            resolvedPath: resolved,
          });
          all[alias][key] = _obj;
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
