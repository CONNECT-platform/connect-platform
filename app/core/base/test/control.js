const assert = require('assert');
const { PinEvents } = require('../pin');
const { ControlPin, ControllerPin } = require('../control');
const { IncompatiblePinTypes } = require('../errors');


describe('ControlPin and ControllerPin', ()=> {

  describe('.activate()', ()=>{

    it('should activate connected ControlPins.', ()=> {
      let a = new ControllerPin();
      let b1 = new ControlPin().connect(a);
      let b2 = new ControlPin().connect(a);

      assert(!b1.activated);
      assert(!b2.activated);

      a.activate();

      assert(b1.activated);
      assert(b2.activated);
    });

    it('should activate a ControlPin if all its ControllerPins are activated.', ()=> {
      let a1 = new ControllerPin();
      let a2 = new ControllerPin();
      let b = new ControlPin().connect(a1).connect(a2);

      assert(!b.activated);

      a1.activate();
      assert(!b.activated);

      a2.activate();
      assert(b.activated);
    });

    it('should be subcribable.', done => {
      let a = new ControllerPin();
      let b = new ControlPin().connect(a);

      b.subscribe(PinEvents.activate, ()=> {done()});
      a.activate();
    });
  });

  describe('.connect()', ()=>
  it('should connect to proper pin type only.', ()=> {
    let a1 = new ControllerPin();
    let a2 = new ControllerPin();
    let b1 = new ControlPin();
    let b2 = new ControlPin();

    assert.throws(() => {
      a1.connect(a2);
    }, IncompatiblePinTypes);

    assert.throws(() => {
      b1.connect(b2);
    }, IncompatiblePinTypes);

    a1.connect(b1);
  }));

});
