const base = require('./base');
const registry = require('./registry');
const { hashSig } = require('../util/hash');

const node = (signature, func) => {
  let _class = class extends base.node.Node {
    constructor() {
      super(signature);
    }

    run(inputs, output, control, error) {
      func(inputs, output, control, error, this.context);
    }
  };
  
  if( ! ('key' in signature) ) {
    signature.key = hashSig(signature);
  }

  if (signature.path)
    registry.register(signature, _class);
  
  return _class;
}

module.exports = node;
