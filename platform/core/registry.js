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

      this._paths[signature.path + signature.method || ''] = entry;
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

  signature(path) {
    let resolved = this.resolve(path);
    let resolvedIndex = this.registered(resolved);
    
    if (resolvedIndex)
      return this._paths[resolved].signature;

    throw new UnregisteredPath(path);
  }

  instance(path, method) {
    let resolved = this.resolve(path+ (method || ''));

    if (this.mocked(resolved)) {
      let instantiated = util.buildFromFactoryOrClass(this._mocks[resolved]);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    let resolvedIndex = this.registered(resolved);
    if (resolvedIndex) {
      let instantiated = util.buildFromFactoryOrClass(this._paths[resolved].factoryOrClass);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    throw new UnregisteredPath(path);
  }

  registered(path) {
    let resolved = this.resolve(path);

    if(resolved in this._paths) return resolved;
    
    let resolvedGET = resolved + "GET";
    if(resolvedGET in this._paths) return resolvedGET;

    let resolvedPOST = resolved + "POST";
    if(resolvedPOST in this._paths) return resolvedPOST;

    let resolvedPUT = resolved + "PUT";
    if(resolvedPUT in this._paths) return resolvedPUT;

    let resolvedDELETE = resolved + "DELETE";
    if(resolvedDELETE in this._paths) return resolvedDELETE;

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

  mock(path, factoryOrClass) {
    this._mocks[path] = factoryOrClass;
    this.publish(RegistryEvents.mocked, {
      path: path,
      factoryOrClass: factoryOrClass,
    });
  }

  unmock(path) {
    delete this._mocks[path];
    this.publish(RegistryEvents.unmocked, path);
  }

  mocked(path) {
    return path in this._mocks;
  }

  get registrants() {
    let all = Object.assign({}, this._paths);
    for (let alias of Object.keys(this._aliases)) {
      let resolved = this.resolve(alias);
      if (resolved in this._paths) {
        let _obj = Object.assign({}, this._paths[resolved]);
        _obj.signature = Object.assign({}, _obj.signature, {
          path: alias,
          resolvedPath : resolved,
        });
        all[alias] = _obj;
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
