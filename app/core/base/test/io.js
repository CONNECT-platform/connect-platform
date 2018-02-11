const assert = require('assert');
const { InputPin, OutputPin, IOPinEvents } = require('../io');
const { IncompatiblePins, PinConnectionError } = require('../errors');


describe('InputPin & OutputPin', ()=> {

  describe('.send() and .receive()', ()=> {
    it('should be able to transfer data and activate the inputs.', ()=> {
      let i1 = new InputPin();
      let i2 = new InputPin();
      let o = new OutputPin().connect(i1).connect(i2);

      o.send('HOLA!');

      assert.equal(i1.data, i2.data);
      assert.equal(i1.data, 'HOLA!');
      assert(i2.activated);
    });

    it('should be subscribable.', done => {
      let i = new InputPin();
      let o = new OutputPin().connect(i);

      i.subscribe(IOPinEvents.receive, data => {
        assert.equal(data, 'HOLA!');
        done();
      });

      o.send('HOLA!');
    });
  });

  describe('.connect()', ()=> {
    it('should only accept proper pin type.', ()=> {
      let i1 = new InputPin();
      let i2 = new InputPin();
      let o1 = new OutputPin();
      let o2 = new OutputPin();

      assert.throws(()=> {
        i1.connect(i2);
      }, IncompatiblePins);

      assert.throws(()=> {
        o1.connect(o2);
      }, IncompatiblePins);

      o1.connect(i1);
    });

    it('should only accept one connection on input pins.', ()=> {
      let i = new InputPin();
      let o1 = new OutputPin();
      let o2 = new OutputPin();

      assert.throws(()=> {
        i.connect(o1);
        i.connect(o2);
      }, PinConnectionError);
    });
  });

  describe('.reset()', ()=> {
    it('should reset transferred data state as well.', ()=> {
      let i = new InputPin();
      let o = new OutputPin().connect(i);

      o.send(2);

      assert.equal(i.data, 2);
      assert.equal(o.data, 2);

      i.reset();
      o.reset();

      assert(!i.data);
      assert(!o.data);
    });
  });
});
