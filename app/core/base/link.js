class Link {
  constructor() {
    this._active = false;
    this._data = undefined;
  }

  get active() {
    return this._active;
  }

  get data() {
    return this._data;
  }

  activate(data) {
    this._data = data;
    this._active = true;

    if (this._to)
      this._to.checkActivate();
  }

  reset() {
    this._active = false;
    this._data = undefined;
  }

  connectFrom(node) {
    this._from = node;
  }

  connectTo(node) {
    this._to = node;
  }

  disconnectFrom() { this._from = null; }
  disconnectTo() { this._to = null; }
}

module.exports = Link;
