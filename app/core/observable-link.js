const base = require('./base');


class ObservableLink extends base.Link {
  constructor() {
    super();
    this._listeners = [];
  }

  subscribe(observer) {
    this._listeners.push(observer);
    return this;
  }

  reset() {
    super.reset();
    this._listeners = [];
  }

  activate(data) {
    super.activate(data);
    for (let listener of this._listeners)
      listener(data);
  }
}

module.exports = ObservableLink;
