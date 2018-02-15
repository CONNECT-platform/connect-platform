const assert = require('assert');
const { Composition } = require('../composition');
const { Recipe } = require('../recipe');


describe('Recipe', () => {
  describe('.add()', () => {
    it('should add instructions.', () => {
      let r = new Recipe();
      r.add(() => {});
    });
  });

  describe('.apply()', () => {
    it('should apply given instructions on given composition.', done => {
      let r = new Recipe();
      let c = new Composition();

      r.add(_c => {
        assert.equal(_c, c);
        done();
      });
      r.apply(c);
    });

    it('should apply given instructions in given order.', () => {
      let r = new Recipe();
      let _ = "";

      r.add(() => _ += 'a');
      r.add(() => _ += 'b');
      r.add(() => _ += 'c');
      r.apply(new Composition());
      assert.equal(_, 'abc');
    });
  });
});
