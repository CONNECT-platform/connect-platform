const base = require('./base');
const registry = require('./registry');


class Call extends base.node.Node {
  constructor(path, method = '') {
    super(registry.signature(path, method));
    this._path = path;
    this._method = method;
  }

  run(inputs, output, control, error) {
    registry.instance(this._path, this._method)
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
