const assert = require('assert');
const node = require('../node');
const registry = require('../registry');
const { Call } = require('../call');
const { IOPinEvents } = require('../base/io');


describe('Call', ()=> {
  it('should call a node registered by a path in registry.', done => {
    console.log('node');
    node({ path: 'X' }, () => { done() });

    console.log('call');
    let c = new Call('X');
    c.checkActivate();
  });

  it('should have the same signature as the class it is going to call.', () => {
    node({ path: 'X', inputs: ['a']}, ()=>{});

    let c = new Call('X');
    assert(c.pins.in.a);
  });

  it('should return the same value as the class it is going to call.', done => {
    node({ path: 'X', inputs: ['a'], outputs: ['b']},
        (inputs, output) => { output('b', inputs.a * 10)});

    let c = new Call('X');
    c.pins.out.b.subscribe(IOPinEvents.send, data => {
      assert.equal(data, 75);
      done();
    });

    c.pins.in.a.receive(7.5);
  });
});
