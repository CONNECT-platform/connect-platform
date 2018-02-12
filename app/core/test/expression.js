const assert = require('assert');
const { Expression } = require('../expression');
const { IOPinEvents } = require('../base/io');


describe('Expression', ()=>{
  it('should be a node that evaluates a given expression.', done => {
    let e = new Expression("[a + 2, a - 2]", ['a']);
    e.pins.result.subscribe(IOPinEvents.send, res => {
      assert.equal(res[0], 7);
      assert.equal(res[1], 3);
      done();
    });

    e.pins.in.a.receive(5);
  });

  it('should naturally work like a raw value when no input is required.', done => {
    let e = new Expression("2 * 3");
    e.pins.result.subscribe(IOPinEvents.send, res => {
      assert.equal(res, 6);
      done();
    });

    e.checkActivate();
  });
});
