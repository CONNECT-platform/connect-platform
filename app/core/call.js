const base = require('./base');
const registry = require('./registry');


class Call extends base.Node {
  constructor(path) {
    if (registry.registered(path)) {
      let signature = registry.signature(path);
      super(signature.inputs, signature.outputs);
    }

    this._path = path;
  }

  run(inputs, respond) {
    registry.instance(this._path).run(inputs, respond);
  }
}

module.exports = Call;
