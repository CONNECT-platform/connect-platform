const base = require('./base');
const script = require('./script');


const _Result = 'result';

class Expression extends base.node.Node {
  constructor(expression, inputs) {
    super({ inputs: inputs || [], outputs: [_Result]});

    this._expr = expression;
    this._script = script(this._expr);
    this.pins.result = this.pins.out[_Result];

    //this._sync = true;
  }

  run(inputs, output, _, error) {
    let context = Object.assign({console, error, require}, inputs);
    let res = this._script.evaluate(context);
    if (typeof res === 'function') {
      if (res.length == 0) output(_Result, res());
      else if (res.length == 1) res(val => output(_Result, val));
      else output(_Result, res);
    }
    else output(_Result, res);
  }
}

module.exports = {
  Expression: Expression,
}
