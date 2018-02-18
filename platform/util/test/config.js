const should = require('chai').should();
const config = require('../config');


describe('config', () => {
  describe('.has()', () => {
    it('should say whether the config has given key.', () => {
      let c = config({x : 2});

      c.has('x').should.be.true;
      c.has('y').should.be.false;
    });
  });

  describe('.get()', () => {
    it('should retrieve the value associated with given key.', () => {
      let c = config({x : 2});

      c.get('x').should.equal(2);
    });

    it('should return undefined if no value is given.', () => {
      let c = config();

      should.not.exist(c.get('x'));
    });
  });

  describe('.append()', () => {
    it('should add values to the config.', () => {
      let c = config({x : 2});
      c.append({y : 3});
      c.has('y').should.be.true;
      c.get('y').should.equal(3);
    });

    it('should override already existing values.', () => {
      let c = config({x : 2, y : 3});
      c.append({y : 4, z : 5});
      c.has('z').should.be.true;
      c.get('y').should.equal(4);
    });

    it('should append array values.', () => {
      let c = config({x : ['somehow', 'someone']});
      c.append({x : ['somewhere']});
      c.get('x').should.include('somewhere');
    });

    it('should not append duplicate array values.', () => {
      let c = config({x : ['a', 'b', 'c']});
      c.append({x : ['a', 'd']});
      c.get('x').should.deep.equal(['a', 'b', 'c', 'd']);
    });

    it('should append arrays at any depth.', () => {
      let c = config({x : {y : ['a', 'b']}});
      c.append({x : {y : ['c']}});
      c.get('x').y.should.include('c');
    });

    it('should extend and override dictionary values.', () => {
      let c = config({x : {y : 2, z : 3}});
      c.append({x : {z : 4, w : 5}});
      c.get('x').should.have.property('w');
      c.get('x').z.should.equal(4);
    });

    it('should extend and override dictionaries at any depth.', () => {
      let c = config({a : {x : {y : 2, z : 3}}});
      c.append({a : {x : {z : 4, w : 5}}});
      c.get('a').x.should.have.property('w');
      c.get('a').x.z.should.equal(4);      
    });
  });
});
