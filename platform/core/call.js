const base = require('./base');
const registry = require('./registry');
const { hashSig } = require('../bind/panel/util/hash');

class Call extends base.node.Node {
  constructor(path, method = '', isPublic = false) {
    const key = hashSig({ path, method, public: isPublic });

    super(registry.signature(path, key));
    this._key = key;
    this._path = path;
    this._method = method;
  }

  run(inputs, output, control, error) {
    registry.instance(this._path, this._key)
      .bind(this.context)
      .run(inputs, output, control, error);
  }

  get path() {
    return this._path;
  }
}

module.exports = {
  Call: Call,
}
