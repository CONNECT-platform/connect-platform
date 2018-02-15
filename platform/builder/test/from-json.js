const assert = require('assert');
const core = require('../../core');
const fromJSON = require('../from-json');
const { Composition } = require('../composition');


describe('fromJSON()', () => {
  core.node({
    path: '/what/tf/',
    inputs: ['name'],
    outputs: ['dn']
  }, (inputs, output) => { output('dn', "dear " + inputs.name); });

  let json = `
    {
      "path": "/something/",

      "in": ["a"],
      "out": ["b"],
      "control": ["bad"],
      "configs": ["max"],

      "nodes": [
        {
          "tag": "min",
          "expr": "3"
        },
        {
          "tag": "cl",
          "in": ["str", "min", "max"],
          "expr": "(str.length >= min) && (str.length <= max)"
        },
        {
          "tag": "d",
          "path": "/what/tf/"
        },
        {
          "tag": "s",
          "cases": ["true", "false"]
        }
      ],

      "links": [
        [{"in": "a"}, [{"cl": {"in": "str"}}, {"d": {"in": "name"}}]],
        [{"config": "max"}, {"cl": {"in": "max"}}],
        [{"min": "result"}, {"cl" : {"in": "min"}}],
        [{"cl": "result"}, {"s": "target"}],
        [{"s": {"case": "true"}}, "d"],
        [{"s": {"case": "false"}}, {"out": "bad"}],
        [{"d": {"out": "dn"}}, {"out": "b"}]
      ]
    }
  `;

  let recipe = fromJSON(json);

  it('should create a recipe from given json.', () => {
    let comp = new Composition();
    recipe.apply(comp);
  });

  it('should be the correct recipe for {a: "jack"} & {max: 5}', done => {
    let comp = new Composition();
    recipe.apply(comp);
    comp.outputs.b.subscribe(core.events.io.receive, res => {
      assert.equal(res, 'dear jack');
      done();
    });

    comp.start({a: 'jack'}, {max: '5'});
  });

  it('should be the correct recipe for {a: "jackie"} & {max: 5}', done => {
    let comp = new Composition();
    recipe.apply(comp);
    comp.outputs.bad.subscribe(core.events.pin.activate, () => {
      done();
    });

    comp.start({a: 'jackie'}, {max: '5'});
  });
});
