const safeEval = require('safe-eval');
const base = require('./base');


const _Result = 'result';

class Expression extends base.Node {
  constructor(inputs, expression) {
    super(inputs, [_Result]);
    this._expr = expression;
  }

  connectResult(link) {
    this.connectOutput(_Result, link);
  }

  disconnectResult(link) {
    this.disconnectOutput(_Result, link);
  }

  run(inputs, respond) {
    respond(_Result, safeEval(this._expr, inputs));
  }
}

module.exports = Expression;
