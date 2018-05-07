const { Subscribable } = require('../core/base/subscribable');


const ScenarioEvents = {
  prepared : 'prepared',
  started : 'started',
  stopped : 'stopped',
}

class Scenario extends Subscribable {
  prepare() {
    this.publish(ScenarioEvents.prepared);
    return this;
  }

  start() {
    this.publish(ScenarioEvents.started);
    return this;
  }

  stop() {
    this.publish(ScenarioEvents.stopped);
    return this;
  }

  stopped(callback) {
    this.subscribe(ScenarioEvents.stopped, callback);
    return this;
  }

  watcher() { }
}

module.exports = {
  Scenario : Scenario,
  ScenarioEvents : ScenarioEvents,
}
