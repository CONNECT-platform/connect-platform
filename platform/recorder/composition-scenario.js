const watch = require('./watch');
const { Scenario } = require('./scenario');


class CompositionScenario extends Scenario {
  constructor(composition, inputs, configs) {
    super();
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
