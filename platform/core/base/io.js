const { Pin } = require('./pin');
const { IncompatiblePins, PinConnectionError } = require('./errors');


const IOPinEvents = {
  receive: 'receive',
  send: 'send',
}

class InputPin extends Pin {
  constructor(optional) {
    super();
    this._data = undefined;
    this._optional = optional || false;
  }

  checkConnection(pin) {
    if (!(pin instanceof OutputPin))
      throw new IncompatiblePins(this, pin);

    return this;
  }

  receive(data) {
    this._activate(()=> {
      this._data = data;
      this.publish(IOPinEvents.receive, data);
    });

    return this;
  }

  get data() { return this._data; }
  get optional() { return this._optional; }

  reset() {
    this._data = undefined;
    super.reset();
    return this;
  }
}

class OutputPin extends Pin {
  constructor() {
    super();
    this._data = undefined;
  }

  checkConnection(pin) {
    if (!(pin instanceof InputPin))
      throw new IncompatiblePins(this, pin);

    return this;
  }

  send(data) {
    this._activate(() => {
      this._data = data;
      this.publish(IOPinEvents.send, data);
      for (let pin of this.connections)
        pin.receive(data);
    })

    return this;
  }

  get data() { return this._data; }

  reset() {
    this._data = undefined;
    super.reset();
    return this;
  }
}

module.exports = {
  InputPin: InputPin,
  OutputPin: OutputPin,
  IOPinEvents: IOPinEvents,
}
