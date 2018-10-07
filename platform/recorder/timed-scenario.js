const { Scenario } = require('./scenario');


const TimedScenarioEvents = {
  timedout: 'timedout',
}

class TimedScenario extends Scenario {
  constructor(timelimit) {
    super();
    this.timelimit = timelimit;
    this._handle = undefined;
  }

  timeout() {
    this.publish(TimedScenarioEvents.timedout);
    return this.stop();
  }

  timedout(callback) {
    this.subscribe(TimedScenarioEvents.timedout, callback);
    return this;
  }

  start() {
    if (this.timelimit) {
      if (this._handle) clearTimeout(this._handle);
      this._handle = setTimeout(() => this.timeout(), this.timelimit);
    }

    return super.start();
  }

  stop() {
    clearTimeout(this._handle);
    return super.stop();
  }
}

module.exports = {
  TimedScenario: TimedScenario,
  TimedScenarioEvents: TimedScenarioEvents,
}
