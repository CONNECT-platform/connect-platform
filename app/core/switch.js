const base = require('./base');
const util = require('./util');


const _Target = 'target';

class Switch extends base.Node {
  constructor(cases) {
    super([_Target], cases);
    this._cases = cases;
  }

  connectTarget(link) {
    this.connectInput(_Target, link);
    return this;
  }

  disconnectTarget(link) {
    this.disconnectInput(_Target, link);
    return this;
  }

  run(inputs, respond) {
    for (let _case of this._cases) {
      if (inputs[_Target] ===  util.evaluate(_case, {}))
        respond(_case);
    }
  }
}

module.exports = Switch;
