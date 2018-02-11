const Expression = require('./expression');


class Value extends Expression {
  constructor(expression) {
    super([], expression);
  }

  connect(link) {
    this.connectResult(link);
    return this;
  }

  disconnect(link) {
    this.disconnectResult(link);
    return this;
  }
}

module.exports = Value;
