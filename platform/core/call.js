const base = require('./base');
const registry = require('./registry');


class Call extends base.node.Node {
  constructor(path) {
    super(registry.signature(path));
    this._path = path;
  }

  run(inputs, output) {
    registry.instance(this._path).run(inputs, output);
  }

  get path() {
    return this._path;
  }
}

module.exports = {
  Call: Call,
}
