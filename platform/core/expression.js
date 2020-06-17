const base = require('./base');
const script = require('./script');


const _Result = 'result';

class Expression extends base.node.Node {
  constructor(expression, inputs) {
    super({ inputs: inputs || [], outputs: [_Result]});

    this._expr = expression;

    try {
      this._script = script(this._expr);
    } catch(error) {
      if (error instanceof SyntaxError)
        this._compileError = new Error(`<p class="hl-red">${error.message}</p>
        <p class="hl-gray">line ${error.stack.split('\n')[0].split(':')[1]}</p><br>${error.stack.split('\n')[1]}`);
      else
        this._compileError = error;
    }

    this.pins.result = this.pins.out[_Result];

    //this._sync = true;
  }

  run(inputs, output, _, error) {
    if (this._compileError) {
      error(this._compileError);
    }
    else {
      let context = Object.assign({ console, error, require, context: this.context, setTimeout, setInterval }, inputs);
      let res = this._script.evaluate(context, inputs);
      if (typeof res === 'function') {
        if (res.length == 0) output(_Result, res());
        else if (res.length == 1) res(val => output(_Result, val));
        else output(_Result, res);
      }
      else output(_Result, res);
    }
  }
}

module.exports = {
  Expression: Expression,
}
