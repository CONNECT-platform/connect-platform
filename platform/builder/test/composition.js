const assert = require('assert');
const core = require('../../core');
const { Composition } = require('../composition');


describe('Composition', () => {
  describe('.addInput()', () => {
    it('should add an input pin.', () => {
      let c = new Composition();
      c.addInput('a');
      assert(c.inputs.a instanceof core.pins.OutputPin);
    });
  });

  describe('.addConfig()', () => {
    it('should add an config pin.', () => {
      let c = new Composition();
      c.addConfig('a');
      assert(c.configs.a instanceof core.pins.OutputPin);
    });
  });

  describe('.addOutput()', () => {
    it('should add an output pin.', () => {
      let c = new Composition();
      c.addOutput('a');
      assert(c.outputs.a instanceof core.pins.InputPin);
    });

    it('should add a control output when requested to.', () => {
      let c = new Composition();
      c.addOutput('a', true);
      assert(c.outputs.a instanceof core.pins.ControlPin);
    });
  });

  describe('.addCall()', () => {
    before(() => {
      core.node({path: '/hellow/world'}, ()=>{});
    });

    it('should add a call node.', () => {
      let c = new Composition();
      c.addCall('x', '/hellow/world');
      assert(c.nodes.x instanceof core.Call);
    });

    it('which has the correct path.', ()=> {
      let c = new Composition();
      c.addCall('x', '/hellow/world');
      assert.equal(c.nodes.x.path, '/hellow/world');
    });
  });

  describe('.addSwitch', () => {
    it('should add a switch node.', () => {
      let c = new Composition();
      c.addSwitch('x', []);
      assert(c.nodes.x instanceof core.Switch);
    });

    it('should has the correct cases.', () => {
      let c = new Composition();
      c.addSwitch('x', ['2']);
      assert(c.nodes.x.pins.cases['2']);
    });
  });

  describe('.addExpr()', () => {
    it('should add an expression.', () => {
      let c = new Composition();
      c.addExpr('x', [], 'null');
      assert(c.nodes.x instanceof core.Expression);
    });

    it('which has the correct inputs.', () => {
      let c = new Composition();
      c.addExpr('x', ['a'], 'a * 2');
      assert(c.nodes.x.pins.in.a);
    });
  });

  describe('.addValue()', () => {
    it('should add an expression without inputs.', () => {
      let c = new Composition();
      c.addValue('x', '22');
      assert(c.nodes.x instanceof core.Expression);
      assert.equal(Object.keys(c.nodes.x.pins.in).length, 0);
    });
  });

  describe('.run()', () => {
    let c = new Composition();
    c.addInput('a')
      .addInput('b')
      .addExpr('e', ['a', 'b'], "(a * b) > 5")
      .addValue('v', "'ok its cool.'")
      .addSwitch('s', ['true', 'false'])
      .addOutput('cool')
      .addOutput('not_cool', true);

    c.nodes.e.pins.in.a.connect(c.inputs.a);
    c.nodes.e.pins.in.b.connect(c.inputs.b);
    c.nodes.s.pins.target.connect(c.nodes.e.pins.result);
    c.nodes.s.pins.cases['true'].connect(c.nodes.v.pins.control);
    c.nodes.s.pins.cases['false'].connect(c.outputs.not_cool);
    c.nodes.v.pins.result.connect(c.outputs.cool);

    it('should be able to run given composition of nodes for inputs {a : 2, b : 3}.', done => {
      c.outputs.cool.subscribe(core.events.io.receive, data => {
        assert.equal(data, 'ok its cool.');
        done();
      });

      c.reset();
      c.start({a: 2, b : 3});
    });

    it('and also giving correct input for {a : 1, b : 4}.', done => {
      c.outputs.not_cool.subscribe(core.events.pin.activate, data => {
        done();
      });

      c.reset();
      c.start({a: 1, b : 4});
    });
  });
});
