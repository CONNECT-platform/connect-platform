const { Subscribable } = require('./subscribable')


const PinEvents = {
  connect: 'connect',
  disconnect: 'disconnect',
  activate: 'activate',
  reset: 'reset',
}

class Pin extends Subscribable {
  constructor() {
    super();
    this._connections = [];
    this._activated = false;
  }

  connected(pin) {
    return this._connections.indexOf(pin) != -1;
  }

  checkConnection(pin) { return this; }

  connect(pin) {
    if (!this.connected(pin)) {
      this.checkConnection(pin);
      this._connections.push(pin);
      pin.connect(this);

      this.publish(PinEvents.connect, pin);
    }

    return this;
  }

  disconnect(pin) {
    if (this.connected(pin)) {
      this._connections = this._connections.filter(p => p != pin);
      pin.disconnect(this);

      this.publish(PinEvents.disconnect, pin);
    }

    return this;
  }

  get connections() {
    return this._connections;
  }

  get activated() {
    return this._activated;
  }

  get bound() {
    return this._connections.length > 0;
  }

  _activate(callback) {
    //if (this.activated)
    //  return;

    this._activated = true;
    if (callback)
      callback();

    this.publish(PinEvents.activate);
    return this;
  }

  reset() {
    this._activated = false;

    this.publish(PinEvents.reset);
    return this;
  }
}

module.exports = {
    Pin: Pin,
    PinEvents: PinEvents,
}
