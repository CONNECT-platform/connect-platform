const assert = require('assert');
const base = require('../base');
const node = require('../node');
const registry = require('../registry');


describe('node()', ()=> {
  it('should generate a node class.', ()=> {
    let N = node({}, ()=>{});
    let n = new N();
    assert(n instanceof base.node.Node);
  });

  it('should register the node class if path is given.', ()=> {
    node({path:'X'}, ()=>{});
    assert(registry.registered('X'));
  });

  it('should return a node that has the same signature.', ()=> {
    let N = node({inputs:['a', 'b'], outputs: ['c']}, ()=>{});
    let n = new N();
    assert(n.pins.in.a);
    assert(n.pins.in.b);
    assert(n.pins.out.c);
  });

  it('should return a node that runs the given function.', done => {
    let N = node({}, ()=>{done();});
    let n = new N();
    n.checkActivate();
  });
});
