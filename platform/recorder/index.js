const { JSONScenario } = require('./json-scenario');
const { ScenarioEvents } = require('./scenario');
const { ConsoleWatcher } = require('./console-watcher');
const { Recorder } = require('./recorder');

module.exports = (json, inputs, configs, timelimit, context) => {
  return new Promise((resolve, reject) => {
    let cwatcher = new ConsoleWatcher();
    let scenario = new JSONScenario(json, inputs, configs, timelimit)
      .subscribe(ScenarioEvents.prepared, () => {
        scenario.watcher().mount('console', cwatcher.watch(console));
      });

    if (context) scenario.bind(context);

    let recorder = new Recorder().finished(() => {
      cwatcher.unhook(console);
      resolve(recorder.recording);
    }).record(scenario);
  });
}
