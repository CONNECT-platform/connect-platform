const util = require('./util');
const { UnregisteredPath } = require('./errors');


class Registry {
  constructor() {
    this._paths = {};
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
    if (this.registered(path))
      return this._paths[path].signature;

    throw new UnregisteredPath(path);
  }

  instance(path) {
    if (this.registered(path))
      return util.buildFromFactoryOrClass(this._paths[path].factoryOrClass);

    throw new UnregisteredPath(path);
  }

  registered(path) {
    return path in this._paths;
  }
}

module.exports = new Registry();
