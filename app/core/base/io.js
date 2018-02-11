const { Pin } = require('./pin');
const { IncompatiblePins, PinConnectionError } = require('./errors');


const IOPinEvents = {
  receive: 'receive',
  send: 'send',
}

class InputPin extends Pin {
  constructor() {
    super();
    this._data = undefined;
  }

  checkConnection(pin) {
    if (this.connections.length > 0)
      throw new PinConnectionError('already connected.', this, pin);

    if (!(pin instanceof OutputPin))
      throw new IncompatiblePins(this, pin);

    return this;
  }

  receive(data) {
    this._data = data;
    this._activate();

    this.publish(IOPinEvents.receive, data);
    return this;
  }

  get data() { return this._data; }

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
    this._data = data;
    this._activate();

    this.publish(IOPinEvents.send, data);

    for (let pin of this.connections)
      pin.receive(data);

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
