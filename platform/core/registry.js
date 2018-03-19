const util = require('../util');
const { UnregisteredPath } = require('./errors');


class Registry {
  constructor() {
    this._paths = {};
    this._aliases = {};
  }

  register(signature, factoryOrClass) {
    if (signature.path) {
      this._paths[signature.path] = {
        signature: signature,
        factoryOrClass: factoryOrClass,
      };
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
    if (this.registered(resolved))
      return util.buildFromFactoryOrClass(this._paths[resolved].factoryOrClass);

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
