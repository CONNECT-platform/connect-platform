const { WatcherEvents, Watcher } = require('./watcher');


class CompositeWatcher extends Watcher {
  constructor(events) {
    super(events);
    this._mounted = {};
  }

  mount(tag, watcher) {
    this._mounted[tag] = watcher;
    watcher.watched(event => {
      this.publish(WatcherEvents.watched, {
        tag: tag,
        cascaded: event,
      });
    });

    return this;
  }
}

module.exports.CompositeWatcher = CompositeWatcher;
