const { Subscribable } = require('../core/base/subscribable');

const { WatcherEvents, Watcher } = require('./watcher');


const ConsoleEvents = {
  logged: 'logged',
  erred: 'erred',
  warned: 'warned',
}

class ConsoleWatcher extends Watcher {
  constructor() {
    super(ConsoleEvents);
  }

  watch(console) {
    console._oldlog = console.log;
    console._olderror = console.error;
    console._oldwarn = console.warn;

    let subject = new Subscribable();

    console.log = (...log) => {
      console._oldlog(...log);
      subject.publish(ConsoleEvents.logged, log);
    }

    console.error = (...error) => {
      console._olderror(...error);
      subject.publish(ConsoleEvents.erred, error);
    }

    console.warn = (...warn) => {
      console._oldwarn(...warn);
      subject.publish(ConsoleEvents.warned, warn);
    }

    return super.watch(subject);
  }

  unhook(console) {
    console.log = console._oldlog || console.log;
    console.error = console._olderror || console.error;
    console.warn = console._oldwarn || console.warn;

    return this;
  }
}

module.exports = {
  ConsoleWatcher: ConsoleWatcher,
  ConsoleEvents: ConsoleEvents,
}
