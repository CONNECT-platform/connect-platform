const base = require('./base');
const registry = require('./registry');


const node = (signature, func) => {
  let _class = class extends base.Node {
    constructor() {
      super(signature.inputs, signature.outputs);
    }

    run(inputs, respond) {
      func(inputs, respond);
    }
  };

  if (signature.path)
    registry.register(signature, _class);
  return _class;
}

module.exports = node;
