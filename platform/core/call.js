const base = require('./base');
const registry = require('./registry');


class Call extends base.node.Node {
  constructor(path) {
    super(registry.signature(path));
    this._path = path;
  }

  run(inputs, output, control, error) {
    registry.instance(this._path)
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
