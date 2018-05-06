const should = require('chai').should();

const fromJSON = require('../../builder/from-json');
const { Composition } = require('../../builder/composition');

const { Recorder, RecorderEvents } = require('../recorder');


describe('Recorder', () => {
  let json = `{
    "path": "/hellow-world/",
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
      [{ "in": "name"}, { "e0": { "in": "name" }}],
      [{ "e0": "result" }, { "out": "message" }],
      [{ "config": "greet" }, { "e0": { "in": "greet" }}]
    ]
  }
  `;

  let recipe = fromJSON(json);
  let comp = new Composition();
  recipe.apply(comp);

  it('should record a given scenario in action', done => {
    let recorder = new Recorder();

    recorder.subscribe(RecorderEvents.finished, () => {
      recorder.recording.length.should.equal(8);
      recorder.recording[0].event.tag.should.equal('in');
      recorder.recording[7].event.tag.should.equal('out');
      done();
    });

    recorder.record({
      composition: comp,
      inputs : { name : 'Joe' },
      configs : { greet : 'Hola' },
    });
  });
});
