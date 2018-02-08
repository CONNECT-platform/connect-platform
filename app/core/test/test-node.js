const node = require('../node');


const TestNode = node({
    path: '/core/test-1/',
    inputs: ['a', 'b'],
    outputs: ['result', 'dont-like-zero', 'bad-params'],
  },
  (inputs, respond) => {
    if (inputs.a != undefined && inputs.b != undefined) {
      if (inputs.b == 0) respond('dont-like-zero');
      else respond('result', {
        winner: inputs.a,
        loser: inputs.b,
      });
    }
    else respond('bad-params');
  }
);

module.exports = TestNode;
