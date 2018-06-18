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

      this._paths[signature.path] = entry;
      this.publish(RegistryEvents.registered, entry);
    }

    return this;
  }

  signature(path) {
    let resolved = this.resolve(path);
    if (this.registered(resolved))
      return this._paths[resolved].signature;

    throw new UnregisteredPath(path);
  }

  instance(path) {
    let resolved = this.resolve(path);

    if (this.mocked(resolved)) {
      let instantiated = util.buildFromFactoryOrClass(this._mocks[resolved]);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    if (this.registered(resolved)) {
      let instantiated = util.buildFromFactoryOrClass(this._paths[resolved].factoryOrClass);
      this.publish(RegistryEvents.instantiated, instantiated);
      return instantiated;
    }

    throw new UnregisteredPath(path);
  }

  registered(path) {
    let resolved = this.resolve(path);
    return resolved in this._paths;
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

module.exports = new Registry();
module.exports.events = RegistryEvents;
