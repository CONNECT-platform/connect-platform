const base = require('./base');
const util = require('./util');


const _Result = 'result';

class Expression extends base.node.Node {
  constructor(expression, inputs) {
    super({ inputs: inputs || [], outputs: [_Result]});

    this._expr = expression;
    this.pins.result = this.pins.out[_Result];
  }

  run(inputs, output) {
    output(_Result, util.evaluate(this._expr, inputs));
  }
}

module.exports = {
  Expression: Expression,
}
