class Subscribable {
  constructor() {
    this.subscribers = {};
  }

  subscribe(event, subscriber) {
    this.subscribers[event] = this.subscribers[event] || [];

    if (this.subscribers[event].indexOf(subscriber) == -1)
      this.subscribers[event].push(subscriber);
    return this;
  }

  unsubscribe(event, subscriber) {
    if (event in this.subscribers)
      this.subscribers[event] = this.subscribers[event].filter(s => s != subscriber);

    return this;
  }

  publish(event, data) {
    if (event in this.subscribers) {
      for (let subscriber of this.subscribers[event])
        subscriber(data, this);
    }

    return this;
  }
}

module.exports = { Subscribable: Subscribable };
