const assert = require('assert');
const { Node, NodeEvents } = require('../node');
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

  describe('constructor()', ()=> {
    it('should generate input pins from signature.', ()=> {
      let n = new Node({
        inputs: ['a', 'b'],
      });

      assert(n.pins.in.a instanceof InputPin);
      assert(n.pins.in.b instanceof InputPin);
    });

    it('should generate output pins from signature.', ()=> {
      let n = new Node({
        outputs: ['a', 'b'],
      });

      assert(n.pins.out.a instanceof OutputPin);
      assert(n.pins.out.b instanceof OutputPin);
    });

    it('should generate a control pin.', ()=> {
      let n = new Node();

      assert(n.pins.control instanceof ControlPin);
    });
  });

  describe('.activated', ()=> {
    it('should be true when all inputs are activated.', ()=> {
      let n = new Node({inputs: ['a', 'b']});

      assert(!n.activated);

      n.pins.in.a.receive(2);
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
      let c = new ControllerPin().connect(n3.pins.control);
      n3.checkActivate();
      assert(!n3.activated);
    });

    it('should result in node\'s running as well.', done => {
      let n = new class extends Node {
        run(){done();}
      }();
      n.checkActivate();
    });
  });
});
