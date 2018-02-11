const { Subscribable } = require('./subscribable');
const { PinEvents } = require('./pin');
const { InputPin, OutputPin, IOPinEvents } = require('./io');
const { ControlPin } = require('./control');
const { WrongNodeOutput } = require('./errors');


const NodeEvents = {
  activate: 'activate',
  reset: 'reset',
}

class Node extends Subscribable {
  constructor(signature) {
    super();
    this._pins = {
      in: {},
      out: {},
      control: new ControlPin(),
    };
    this._signature = signature || {};
    this._activated = false;
    this
      ._generateInputPins()
      ._generateOutputPins()
      ._bindActivation()
      ._bindExecute()
      ;
  }

  _generateInputPins() {
    if (this.signature.inputs) {
      for (let input of this.signature.inputs)
        this._pins.in[input] = new InputPin();
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
    this._activated = true;
    this.publish(NodeEvents.activate);
    return this;
  }

  _execute() {
    let inputs = {};
    for (let [input, pin] of Object.entries(this.pins.in))
      inputs[input] = pin.data;

    new Promise(resolve => {
      this.run(inputs, (output, data) => {
        resolve({output: output, data: data});
      });
    }).then(({output, data}) => {
      if (!(output in this.pins.out))
        throw new WrongNodeOutput(this, output);

      this.pins.out[output].send(data);
    });
  }

  get activated() { return this._activated; }
  get pins() { return this._pins; }
  get signature() { return this._signature; }

  get canActivate() {
    for (let pin of Object.values(this.pins.in))
      if (!pin.activated) return false;

    return this.pins.control.activated ||
        this.pins.control.connections.length == 0;
  }

  checkActivate() {
    if (!this.canActivate) return;

    this._activate();
    return this;
  }

  run(inputs, output) {}

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
  Node: Node,
  NodeEvents: NodeEvents,
}
