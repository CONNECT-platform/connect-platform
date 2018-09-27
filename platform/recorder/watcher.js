const { Subscribable } = require('../core/base/subscribable');


const WatcherEvents = {
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
          let _data = data;
          if (typeof(data) === 'object')
            if (Array.isArray(data)) _data = data.slice();
            else if (data instanceof Error || (
              data.constructor.name.endsWith('Error') &&
              data.name && data.stack
            ))
              _data = {
                message: data.message,
                stack: data.stack,
              };
            else _data = Object.assign({}, data);

          this.publish(WatcherEvents.watched, {
            event: event,
            data: _data,
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

  get events() { return this._events; }
}

module.exports = {
  WatcherEvents : WatcherEvents,
  Watcher : Watcher,
}
