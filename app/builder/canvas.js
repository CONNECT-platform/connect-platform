const core = require('../core');


class Canvas {
  constructor(){
    this._inputs = {};
    this._outputs = {};
    this._controlOuts = {};
    this._configs = {};
    this._nodes = {};
  }

  addInput(name) {
    this._inputs[name] = new core.pins.OutputPin();
    return this;
  }

  addOutput(name, control) {
    if (control)
      this._controlOuts[name] = new core.pins.ControlPin();
    else
      this._outputs[name] = new core.pins.InputPin();

    return this;
  }

  addConfig(name) {
    this._configs[name] = new core.pins.OutputPin();
  }

  removeInput(name) {
    delete this._inputs[name];
    return this;
  }

  removeOutput(name) {
    delete this._outputs[name];
    delete this._controlOuts[name];
    return this;
  }

  removeConfig(name) {
    delete this._configs[name];
    return this;
  }

  addCall(tag, path) {
    this._nodes[tag] = new core.Call(path);
    return this;
  }

  addSwitch(tag, cases) {
    this._nodes[tag] = new core.Switch(cases);
    return this;
  }

  addExpr(tag, ins, expr) {
    this._nodes[tag] = new core.Expression(ins, expr);
  }
}
