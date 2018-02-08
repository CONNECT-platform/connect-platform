const Expression = require('./expression');


class Value extends Expression {
  constructor(expression) {
    super([], expression);
  }

  connect(link) {
    super.connectResult(link);
  }
}

module.exports = Value;
