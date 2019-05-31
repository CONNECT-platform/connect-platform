const assert = require('assert');
const base = require('../base');
const callable = require('../callable');
const { InputMissing } = require('../errors');


describe('callable()', ()=> {
  it('should return a callable that runs the given node.', done => {
    class N extends base.node.Node {
      constructor(){
        super({
          inputs: ['a'],
          outputs: ['res'],
        });
      }

      run(inputs, output){
        output('res', inputs.a + 5);
      }
    };

    let f = callable(N);

    f({a: 4}).then(result => {
      assert.equal(result.output, 'res');
      assert.equal(result.data, 9);
      done();
    });
  });

  it('should also handle control output of the node.', done => {
    class N2 extends base.node.Node {
      constructor(){
        super({controlOutputs: ['c']});
      }

      run(i, o, control) {
        control('c');
      }
    };

    let f = callable(N2);

    f().then(result => {
      assert.equal(result.control, 'c');
      done();
    });
  });

  it('should throw proper error if required input not provided.', done => {
    class N extends base.node.Node {
      constructor(){super({inputs: ['a', 'b']});}
    }

    let f = callable(N);

    f({b: 'hellow'}).catch(error => {
      assert(error instanceof InputMissing);
      done();
    });
  });

  it('should not throw an error for missing optional inputs.', done => {
    class N extends base.node.Node {
      constructor(){super({inputs: ['a'], optionalInputs: ['b', 'c'], outputs: ['a']});}

      run(i, o) {
        assert(i.a == 2);
        assert(i.c == 3);
        o('a', 'cool');
      }
    }

    let f = callable(N);
    f({a: 2, c: 3})
      .then(() => done());
  });
});
