const util = require('./util');


class Registry {
  constructor() {
    this._paths = {};
  }

  register(signature, factoryOrClass) {
    this._paths[signature.path] = {
      signature: signature,
      factoryOrClass: factoryOrClass,
    };

    return this;
  }

  signature(path) {
    if (this.registered(path))
      return this._paths[path].signature;
  }

  instance(path) {
    if (this.registered(path))
      return util.buildFromFactoryOrClass(this._paths[path].factoryOrClass);
  }

  registered(path) {
    return path in this._paths;
  }
}

module.exports = new Registry();
