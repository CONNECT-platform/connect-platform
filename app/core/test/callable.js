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
});
