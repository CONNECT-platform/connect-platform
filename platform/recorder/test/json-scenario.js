const { JSONScenario } = require('../json-scenario');
const { Recorder } = require('../recorder');


describe('JSONScenario', () => {
  let json = `
  {
    "in": [ "name" ],
    "out": [ "message" ],
    "configs": [ "greet" ],
    "control": [],
    "nodes": [
      {
        "tag": "e0",
        "in": [ "name", "greet" ],
        "expr": "greet + ' ' + name"
      }
    ],
    "links": [
      [{ "in": "name" }, { "e0": { "in": "name" }}],
      [{ "e0": "result" }, { "out": "message" }],
      [{ "config": "greet" }, { "e0": { "in": "greet" }}]
    ]
  }
  `;

  it('should represent a scenario for given json composition and parameters.', done => {
    let scenario = new JSONScenario(json, { name : 'Joe'}, { greet : 'Hola' });

    new Recorder()
      .finished((_, recorder) => {
        recorder.recording.length.should.equal(8);
        recorder.recording[0].event.tag.should.equal('in');
        recorder.recording[7].event.tag.should.equal('out');
        done();
      })
      .record(scenario);
  });
});
