const base = require('./base');
const script = require('./script');


const _Result = 'result';

class Expression extends base.node.Node {
  constructor(expression, inputs) {
    super({ inputs: inputs || [], outputs: [_Result]});

    this._expr = expression;
    this._script = script(this._expr);
    this.pins.result = this.pins.out[_Result];

    this._sync = true;
  }

  run(inputs, output) {
    output(_Result, this._script.evaluate(inputs));
  }
}

module.exports = {
  Expression: Expression,
}
