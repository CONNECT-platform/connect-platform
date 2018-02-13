const base = require('./base');
const util = require('./util');
const { InputMissing } = require('./errors');


const _Target = 'target';

class Switch extends base.node.Node {
  constructor(cases) {
    super({ inputs: [_Target], controlOutputs: cases });

    this.pins.target = this.pins.in[_Target];
    this.pins.cases = this.pins.controlOut;
    this._cases = cases;
  }

  get cases() { return this._cases; }

  run(inputs, _, control) {
    if (!(_Target in inputs))
      throw new InputMissing(_Target, inputs);

    for (let _case of this.cases) {
      if (inputs[_Target] ===  util.evaluate(_case, {})) {
        control(_case);
      }
    }
  }
}

module.exports = {
  Switch: Switch
}
