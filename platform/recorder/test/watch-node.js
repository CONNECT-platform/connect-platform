const should = require('chai').should();

const watch = require('../watch');
const core = require('../../core');


describe('watch() for nodes', () => {
  it('should watch nodes correctly', done => {
    let Node = core.node({
      inputs: ['a'],
      outputs: ['b'],
    }, (inputs, output) => {
      output('b', 'world');
    });

    let node = new Node();

    let inputWatched = false;
    let outputWatched = false;
    let nodeActivationWatched = false;

    watch(node).watched(event => {
      if (event.tag == 'in') {
        inputWatched = true;

        event.cascaded.tag.should.equal('a');
        event.cascaded.cascaded.data.should.equal('hellow');
      }

      if (event.tag == 'out') {
        outputWatched = true;

        event.cascaded.tag.should.equal('b');
        event.cascaded.cascaded.data.should.equal('world');
      }

      if (event.event == core.events.node.activate) {
        nodeActivationWatched = true;
      }

      if (inputWatched && outputWatched && nodeActivationWatched) done();
    });

    core.callable(() => node)({a : 'hellow'});
  });
});
