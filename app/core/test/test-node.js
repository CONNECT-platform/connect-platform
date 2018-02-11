const node = require('../node');


const TestNode = node({
    path: '/core/test-1/',
    inputs: ['a', 'b'],
    outputs: ['result', 'dont_like_zero', 'bad_params'],
  },
  (inputs, respond) => {
    if (inputs.a != undefined && inputs.b != undefined) {
      if (inputs.b == 0) respond('dont_like_zero');
      else respond('result', {
        winner: inputs.a,
        loser: inputs.b,
      });
    }
    else respond('bad_params');
  }
);

module.exports = TestNode;
