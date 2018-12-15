const util = require('util');

const { Subscribable } = require('../core/base/subscribable');

const { WatcherEvents, Watcher } = require('./watcher');


const ConsoleEvents = {
  log: 'log',
  info: 'info',
  error: 'error',
  warn: 'warn',
  debug: 'debug',
}

class ConsoleWatcher extends Watcher {
  constructor() {
    super(ConsoleEvents);
    this.watching = [];
  }

  find(console) {
    return this.watching.find(entry => entry.console == console);
  }

  hook(console) {
    if (!this.find(console)) {
      let entry = {
        console: console,
        log: console.log,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
        info: console.info,
      };

      this.watching.push(entry);
      return entry;
    }
  }

  watch(console) {
    let entry = this.hook(console);
    if (!entry) return;

    let subject = new Subscribable();

    console.log = (...log) => {
      entry.log.apply(console, log);
      subject.publish(ConsoleEvents.log, util.format(...log));
    }

    console.error = (...error) => {
      entry.error.apply(console, error);
      subject.publish(ConsoleEvents.error, util.format(...error));
    }

    console.warn = (...warn) => {
      entry.warn.apply(console, warn);
      subject.publish(ConsoleEvents.warn, util.format(...warn));
    }

    console.debug = (...debug) => {
      entry.debug.apply(console, debug);
      subject.publish(ConsoleEvents.debug, util.format(...debug));
    }

    console.info = (...info) => {
      entry.debug.apply(console, info);
      subject.publish(ConsoleEvents.info, util.format(...info));
    }

    return super.watch(subject);
  }

  unhook(console) {
    let entry = this.find(console);
    if (!entry) return;

    console.log = entry.log;
    console.error = entry.error;
    console.warn = entry.warn;
    console.debug = entry.debug;
    console.info = entry.info;

    this.watching = this.watching.filter(entry => entry.console != console);

    return this;
  }
}

module.exports = {
  ConsoleWatcher: ConsoleWatcher,
  ConsoleEvents: ConsoleEvents,
}
