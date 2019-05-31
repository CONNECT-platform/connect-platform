const assert = require('assert');
const { Node, NodeEvents } = require('../node');
const { PinEvents } = require('../pin');
const { InputPin, OutputPin, IOPinEvents } = require('../io');
const { ControlPin, ControllerPin } = require('../control');


describe('Node', ()=> {

  it('should run the run() method when activated and send results to output pins.', done => {
    let n = new class extends Node {
      run(inputs, output) {
        output('res', inputs.a * 2);
      }
    }({inputs: ['a'], outputs:['res']});

    n.pins.out.res.subscribe(IOPinEvents.send, data => {
      assert.equal(data, 6);
      done();
    });

    n.pins.in.a.receive(3);
  });

  it('should run the run() method when activated and activate proper controller pins.', done => {
    let n = new class extends Node {
      run(_, __, control) {
        control('x');
      }
    }({inputs: ['a'], controlOutputs: ['x']});

    n.pins.controlOut.x.subscribe(PinEvents.activate, () => {
      done();
    });

    n.pins.in.a.receive('stuff.');
  });

  it('should have its control pin reset after activation.', done => {
    let n = new class extends Node {
      run(_, __, control) {
        control('done');
      }
    }({inputs: ['a'], controlOutputs: ['done']});

    n.pins.control.subscribe(PinEvents.reset, () => {
      done();
    });

    n.pins.in.a.receive('stuff');
  });

  it.skip('should stop run() after ouput is given.', done => {
    let life = 2;
    let n1 = new class extends Node {
      run(inputs, output) {
        life += 1;
        output('res', inputs.a);
        life += 1;
      }
    }({inputs: ['a'], outputs:['res']});

    n1.pins.out.res.subscribe(IOPinEvents.send, data => {
      assert.equal(life, 3);
      done();
    });

    n1.pins.in.a.receive('well ...');
  });

  it.skip('should stop the run() when control called.', done => {
    let life = 4;
    let n = new class extends Node {
      run(_, __, control) {
        life += 1;
        control('x');
        life += 1;
      }
    }({inputs: ['a'], controlOutputs: ['x']});

    n.pins.controlOut.x.subscribe(PinEvents.activate, () => {
      assert.equal(life, 5);
      done();
    });

    n.pins.in.a.receive('stuff.');
  });

  describe('constructor()', ()=> {
    it('should generate input pins from signature.', ()=> {
      let n = new Node({
        inputs: ['a', 'b'],
      });

      assert(n.pins.in.a instanceof InputPin);
      assert(n.pins.in.b instanceof InputPin);
      assert(!n.pins.in.a.optional);
    });

    it('should generate optional input pins from signature.', () => {
      let n = new Node({
        optionalInputs: ['a', 'b'],
      });

      assert(n.pins.in.a instanceof InputPin);
      assert(n.pins.in.b instanceof InputPin);
      assert(n.pins.in.a.optional);
    });

    it('should generate output pins from signature.', ()=> {
      let n = new Node({
        outputs: ['a', 'b'],
      });

      assert(n.pins.out.a instanceof OutputPin);
      assert(n.pins.out.b instanceof OutputPin);
    });

    it('should generate control output pins from signature.', ()=> {
      let n = new Node({
        controlOutputs: ['a', 'b']
      });

      assert(n.pins.controlOut.a instanceof ControllerPin);
      assert(n.pins.controlOut.b instanceof ControllerPin);
    });

    it('should generate a control pin.', ()=> {
      let n = new Node();

      assert(n.pins.control instanceof ControlPin);
    });
  });

  describe('.activated', ()=> {
    it('should be true when all inputs are activated.', ()=> {
      let n = new Node({inputs: ['a', 'b'], optionalInputs: ['c']});

      assert(!n.activated);

      n.pins.in.a.receive(2);
      n.pins.in.b.receive(3);

      assert(n.activated);
    });

    it('should not be true when bound optional inputs are not activated.', () => {
      let n = new Node({inputs: ['a'], optionalInputs: ['b', 'c']});
      new OutputPin().connect(n.pins.in.b);

      n.pins.in.a.receive(2);
      assert(!n.activated);

      n.pins.in.b.receive(3);
      assert(n.activated);
    });

    it('should check controllers connected to control pin.', ()=> {
      let n = new Node({inputs: ['a']});
      let c1 = new ControllerPin().connect(n.pins.control);
      let c2 = new ControllerPin().connect(n.pins.control);

      n.pins.in.a.receive();
      assert(!n.activated);

      c1.activate();
      assert(!n.activated);

      c2.activate();
      assert(n.activated);
    });

    it('should be subscribable.', done => {
      let n = new Node({inputs: ['a']});

      n.subscribe(NodeEvents.activate, ()=>{done()});
      n.pins.in.a.receive();
    });
  });

  describe('.reset()', ()=> {
    it('should reset node\'s state.', ()=> {
      let n = new Node({inputs:['a']});

      n.pins.in.a.receive(2);
      assert(n.activated);

      n.reset();
      assert(!n.activated);
    });

    it('should also reset state of all its pins.', ()=> {
      let n = new class extends Node {
        run(inputs, output) {
          output('res', inputs.a * 2);
        }
      }({inputs: ['a'], outputs:['res']});

      return new Promise(resolve=> {
        n.pins.in.a.receive(4);

        n.pins.out.res.subscribe(IOPinEvents.send, ()=> {
          assert(n.pins.in.a.activated);
          assert(n.pins.out.res.activated);

          n.reset();
          assert(!n.pins.in.a.activated);
          assert(!n.pins.out.res.activated);
          assert(!n.pins.in.a.data);

          resolve();
        });
      });
    });

    it('should be subscribable.', done => {
      let n = new Node();
      n.subscribe(NodeEvents.reset, ()=>{done()});
      n.reset();
    });
  });

  describe('.checkActivate()', () => {
    it('should activate a node when it can be activated.', ()=> {
      let n = new Node();
      n.checkActivate();
      assert(n.activated);

      let n2 = new Node({inputs: ['a']});
      n2.checkActivate();
      assert(!n2.activated);

      let n3 = new Node();
      new ControllerPin().connect(n3.pins.control);
      n3.checkActivate();
      assert(!n3.activated);

      let n4 = new Node({optionalInputs: ['a']});
      n4.checkActivate();
      assert(n4.activated);

      let n5 = new Node({optionalInputs: ['a']});
      new OutputPin().connect(n5.pins.in.a);
      n5.checkActivate();
      assert(!n5.activated);
    });

    it('should result in node\'s running as well.', done => {
      let n = new class extends Node {
        run(){done();}
      }();
      n.checkActivate();
    });
  });
});
