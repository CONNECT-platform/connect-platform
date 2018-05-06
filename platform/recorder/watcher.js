const { Subscribable } = require('../core/base/subscribable');


const WatcherEvents = {
  bound : 'watching',
  watched : 'watched',
}

class Watcher extends Subscribable {
  constructor(events) {
    super();
    this._events = events;
  }

  watch(subject) {
    if (this.events) {
      Object.values(this.events).forEach(event => {
        subject.subscribe(event, data => {
          this.publish(WatcherEvents.watched, {
            event: event,
            data: data,
            subject: subject,
          });
        });
      });

      this.publish(WatcherEvents.watching, {
        subject: subject,
        events: this.events,
      });
    }

    return this;
  }

  watched(callback) {
    this.subscribe(WatcherEvents.watched, callback);
    return this;
  }

  bind() {
  }

  get events() { return this._events; }
}

module.exports = {
  WatcherEvents : WatcherEvents,
  Watcher : Watcher,
}
