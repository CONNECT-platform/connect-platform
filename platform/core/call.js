const base = require('./base');
const registry = require('./registry');
const { hashSig } = require('../util/hash');

class Call extends base.node.Node {
  constructor(path, key) {
    if(key === undefined) {
      key = hashSig({ path });
    }

    if(! registry.registered(path, key)) key = registry.resolveDefaultKey(path);

    super(registry.signature(path, key));
    this._key = key;
    this._path = path;
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
