const assert = require('assert');
const core = require('../../core');
const { Composition } = require('../composition');
const { Composite } = require('../composite');


describe('Composite', () => {
  it('should be a node that runs a composition.', done => {
    let comp = new Composition();
    comp.addValue('v', '"Hellow World!"');
    comp.addOutput('x');
    comp.nodes.v.pins.result.connect(comp.outputs.x);

    let c = new Composite(comp);
    c.pins.out.x.subscribe(core.events.io.send, x => {
      assert.equal(x, 'Hellow World!');
      done();
    });

    c.checkActivate();
  });
});
