const base = require('./base');
const script = require('./script');
const { InputMissing } = require('./errors');


const _Target = 'target';
const _Default = '...';

class Switch extends base.node.Node {
  constructor(cases) {
    super({ inputs: [_Target], controlOutputs: cases });

    this.pins.target = this.pins.in[_Target];
    this.pins.cases = this.pins.controlOut;
    this._cases = cases;
    this._scripts = {};
    for (let _case of this._cases) {
      if (_case != _Default)
        this._scripts[_case] = script(_case);
    }

    //this._sync = true;
  }

  get cases() { return this._cases; }

  run(inputs, _, control) {
    if (!(_Target in inputs))
      throw new InputMissing(_Target, inputs);

    for (let _case of this.cases) {
      if (_case == _Default) {
        control(_case);
        return;
      }

      if (inputs[_Target] ===  this._scripts[_case].evaluate({})) {
        control(_case);
        return;
      }
    }
  }
}

module.exports = {
  Switch: Switch
}
