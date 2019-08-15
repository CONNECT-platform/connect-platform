const { Subscribable } = require('./subscribable');
const { PinEvents } = require('./pin');
const { InputPin, OutputPin, IOPinEvents } = require('./io');
const { ControlPin, ControllerPin } = require('./control');
const { WrongNodeOutput } = require('./errors');


const NodeEvents = {
  activate: 'activate',
  reset: 'reset',
  promised: 'promised',
  error: 'error',
}

class Break {}

class OutputBreak extends Break {
  constructor(output, data) {
    super();
    this.output = output;
    this.data = data;
  }
}

class ControlBreak extends Break {
  constructor(control) {
    super();
    this.control = control;
  }
}

class Node extends Subscribable {
  constructor(signature) {
    super();
    this._pins = {
      in: {},
      out: {},
      control: new ControlPin(),
      controlOut: {},
    };
    this._signature = signature || {};
    this._activated = false;
    this
      ._generateInputPins()
      ._generateOutputPins()
      ._generateControlOutputPins()
      ._bindActivation()
      ._bindExecute()
      ;

    this._context = {};

    this._sync = false;
  }

  _generateInputPins() {
    if (this.signature.inputs) {
      for (let input of this.signature.inputs)
        this._pins.in[input] = new InputPin();
    }

    if (this.signature.optionalInputs) {
      for (let input of this.signature.optionalInputs)
        this._pins.in[input] = new InputPin(true);
    }

    return this;
  }

  _generateOutputPins() {
    if (this.signature.outputs) {
      for (let output of this.signature.outputs)
        this._pins.out[output] = new OutputPin();
    }

    return this;
  }

  _generateControlOutputPins() {
    if (this.signature.controlOutputs) {
      for (let control of this.signature.controlOutputs)
        this._pins.controlOut[control] = new ControllerPin();
    }

    return this;
  }

  _bindActivation() {
    let _ca = this.checkActivate.bind(this);
    for (let pin of Object.values(this.pins.in))
      pin.subscribe(PinEvents.activate, _ca);

    this.pins.control.subscribe(PinEvents.activate, _ca);
    return this;
  }

  _bindExecute() {
    this.subscribe(NodeEvents.activate, this._execute.bind(this));
    return this;
  }

  _activate() {
    //if (this.activated)
    //  return;

    this._activated = true;
    this.publish(NodeEvents.activate);
    return this;
  }

  _execute() {
    if (this._sync)
      this._executeSync();
    else {
      let promise = this._executeAsync();
      this.publish(NodeEvents.promised, promise);
    }
  }

  _prepareInputs() {
    let inputs = {};
    for (let [input, pin] of Object.entries(this.pins.in)) {
      if (pin.optional) {
        if (pin.activated) inputs[input] = pin.data;
      }
      else
        inputs[input] = pin.data;
    }

    return inputs;
  }

  _handleBreak(_break, unrecongized) {
    if (_break instanceof OutputBreak) {
      let { output, data } = _break;

      if (!(output in this.pins.out))
        throw new WrongNodeOutput(this, output);

      this.pins.out[output].send(data);
    }
    else if (_break instanceof ControlBreak) {
      let { control } = _break;

      if (!(control in this.pins.controlOut))
        throw new WrongNodeOutput(this, control);

      this.pins.controlOut[control].activate();
    }
    else {
      if (unrecongized)
        unrecongized(_break);
    }

    this.pins.control.reset();
  }

  _executeSync() {
    let inputs = this._prepareInputs();

    try {
      this.run(inputs, (output, data) => {
        let _break = new OutputBreak(output, data);
        throw _break;
      }, control => {
        let _break = new ControlBreak(control);
        throw _break;
      }, error => {
        this.error(error);
      });
    } catch(_break) {
      this._handleBreak(_break, error => {
        this.error(error);
      });
    };
  }

  _executeAsync() {
    let inputs = this._prepareInputs();

    return new Promise((resolve, reject) => {
      this.run(inputs, (output, data) => {
        let _break = new OutputBreak(output, data);
        resolve(_break);
      },
      control => {
        let _break = new ControlBreak(control);
        resolve(_break);
      },
      error => {
        this.error(error);
      });
    }).then(_break => {
      this._handleBreak(_break);
    }).catch(error => {
      if (!(error instanceof Break)) {
        this.error(error);
      }
    });
  }

  get activated() { return this._activated; }
  get pins() { return this._pins; }
  get signature() { return this._signature; }

  get canActivate() {
    for (let pin of Object.values(this.pins.in))
      if (!pin.activated && (!pin.optional || pin.bound))
        return false;

    return this.pins.control.activated ||
        !this.pins.control.bound;
  }

  checkActivate() {
    if (!this.canActivate) return;

    this._activate();
    return this;
  }

  run(inputs, output, control, error) {}

  bind(context) {
    this._context = context;
    return this;
  }

  get context() { return this._context; }

  error(error) {
    if (typeof error == 'string')
      error = new Error(error);
    this.publish(NodeEvents.error, error);
  }

  reset() {
    this._activated = false;

    for (let pin of Object.values(this.pins.in))
      pin.reset();

    for (let pin of Object.values(this.pins.out))
      pin.reset();

    this.pins.control.reset();
    this.publish(NodeEvents.reset);

    return this;
  }
}

module.exports = {
  Break: Break,
  Node: Node,
  NodeEvents: NodeEvents,
}
