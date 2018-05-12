const now = require('../util/now');
const core = require('../core');
const { Subscribable } = require('../core/base/subscribable');

const watch = require('./watch');


const RecorderEvents = {
  started : 'started',
  finished : 'finished',
}

class Recorder extends Subscribable {
  constructor() {
    super();
    this._recording = [];
  }

  get recording() { return this._recording; }

  record(scenario) {
    this.publish(RecorderEvents.started, scenario);

    let start = -1;
    this._recording = [];

    scenario
      .prepare()
      .watcher().watched(event => {
      if (start == -1) start = now();
      let timestamp = now() - start;
      this._recording.push({
        time : timestamp,
        event : event,
      });
    });

    scenario
      .stopped(() => this.publish(RecorderEvents.finished))
      .start();

    return this;
  }

  finished(callback) {
    this.subscribe(RecorderEvents.finished, callback);
    return this;
  }

}

module.exports = {
  Recorder : Recorder,
  RecorderEvents : RecorderEvents,
}
