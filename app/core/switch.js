const base = require('./base');
const util = require('./util');
const { InputMissing } = require('./errors');


const _Target = 'target';

class Switch extends base.node.Node {
  constructor(cases) {
    super({ inputs: [_Target] });

    this.pins.target = this.pins.in[_Target];
    this.pins.cases = {};
    for (let _case of cases)
      this.pins.cases[_case] = new base.control.ControllerPin();
  }

  run(inputs, done) {
    if (!(_Target in inputs))
      throw new InputMissing(_Target, inputs);

    for (let [_case, pin] of Object.entries(this.pins.cases)) {
      if (inputs[_Target] ===  util.evaluate(_case, {})) {
        pin.activate();
        break;
      }
    }

    done();
  }
}

module.exports = {
  Switch: Switch
}
