export class Subscribable {
  private subscribers: Object;

  constructor() {
    this.subscribers = {}
  }

  public subscribe(event, callback): Subscribable {
    this.subscribers[event] = this.subscribers[event] || [];
    this.subscribers[event].push(callback);
    return this;
  }

  public unsubscribe(event, callback): Subscribable {
    if (this.subscribers[event])
      this.subscribers[event] = this.subscribers[event].filter(c => c != callback);
    return this;
  }

  public publish(event, data): Subscribable {
    if (this.subscribers[event])
      for (let callback of this.subscribers[event])
        callback(data, this);
    return this;
  }
}
