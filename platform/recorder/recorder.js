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

    watch(scenario.composition).watched(event => {
      if (start == -1) start = this._now();
      let timestamp = this._now() - start;
      this._recording.push({
        time : timestamp,
        event : event,
      });

      if (event.tag == 'out')
        this.publish(RecorderEvents.finished, scenario);
    });

    scenario.composition.start(scenario.inputs, scenario.configs);
  }

  _now() {
    let hrtime = process.hrtime();
    return hrtime[0] * 1000 + hrtime[1] / 1000000;
  }
}

module.exports = {
  Recorder : Recorder,
  RecorderEvents : RecorderEvents,
}
