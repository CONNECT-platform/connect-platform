const { JSONScenario } = require('./json-scenario');
const { Recorder } = require('./recorder');

module.exports = (json, inputs, configs) => {
  return new Promise((resolve, reject) => {
    let scenario = new JSONScenario(json, inputs, configs)
    let recorder = new Recorder().finished(() => {
      resolve(recorder.recording);
    }).record(scenario);
  });
}
