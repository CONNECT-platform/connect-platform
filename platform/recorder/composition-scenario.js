const watch = require('./watch');
const { TimedScenario } = require('./timed-scenario');


class CompositionScenario extends TimedScenario {
  constructor(composition, inputs, configs, timelimit) {
    super(timelimit);
    this.composition = composition;
    this.inputs = inputs;
    this.configs = configs;
  }

  watcher() {
    return this._watcher;
  }

  prepare() {
    this._watcher = watch(this.composition);
    return super.prepare();
  }

  start() {
    this.composition.start(this.inputs, this.configs);
    this._watcher.watched(event => {
      if (event.tag == 'out') this.stop();
      else if (event.tag == 'node' && event.cascaded.cascaded.event == 'error') this.stop();
    });
    return super.start();
  }
}

module.exports.CompositionScenario = CompositionScenario;
