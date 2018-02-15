const { Pin, PinEvents } = require('./pin');
const { IncompatiblePins } = require('./errors');


class ControllerPin extends Pin {
  checkConnection(pin, callback) {
    if (!(pin instanceof ControlPin))
      throw new IncompatiblePins(this, pin);

    return this;
  }

  activate() {
    this._activate();
    return this;
  }
}

class ControlPin extends Pin {
  constructor() {
    super();
    this.__checkActivate = this._checkActivate.bind(this);

    this.subscribe(PinEvents.connect, pin => {
      pin.subscribe(PinEvents.activate, this.__checkActivate);
      this._checkActivate();
    });

    this.subscribe(PinEvents.disconnect, pin => {
      pin.unsubscribe(PinEvents.activate, this.__checkActivate);
      this._checkActivate();
    });
  }

  checkConnection(pin) {
    if (!(pin instanceof ControllerPin))
      throw new IncompatiblePins(this, pin);

    return this;
  }

  _checkActivate() {
    for (let pin of this.connections) {
      if (!pin.activated)
        return;
    }

    this._activate();
  }
}

module.exports = {
  ControlPin: ControlPin,
  ControllerPin: ControllerPin,
}
