const base = require('./base');
const registry = require('./registry');


const node = (signature, func) => {
  let _class = class extends base.node.Node {
    constructor() {
      super(signature);
    }

    run(inputs, output) {
      func(inputs, output);
    }
  };

  if (signature.path)
    registry.register(signature, _class);
  return _class;
}

module.exports = node;
