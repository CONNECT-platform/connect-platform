const assert = require('assert');
const { Pin, PinEvents } = require('../pin');


describe('Pin', ()=> {

  describe('.connect() and .disconnect()', ()=>
  it('should connect and disconnect two pins.', ()=> {
    let a = new Pin();
    let b = new Pin();

    a.connect(b);

    assert(a.connected(b));
    assert(b.connected(a));

    b.disconnect(a);

    assert(!a.connected(b));
    assert(!b.connected(a));
  }));

  describe('.reset()', ()=> {
    it('should reset pin\'s state.', ()=> {
      let a = new Pin();

      a._activate();
      assert(a.activated);

      a.reset();
      assert(!a.activated);
    });

    it('should be subscribable.', done => {
      let a = new Pin();
      a.subscribe(PinEvents.reset, ()=>{done()});
      a.reset();
    });
  });

  describe('.bound', () => {
    it('should be true if the pin has any connections.', () => {
      let a = new Pin();
      let b = new Pin();

      a.connect(b);

      assert(a.bound);
    });

    it('should be false if the pin does not have any connections.', () => {
      let a = new Pin();
      assert(!a.bound);
    });
  });
});
