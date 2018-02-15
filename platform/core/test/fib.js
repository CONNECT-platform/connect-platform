const assert = require('assert');
const node = require('../node');
const callable = require('../callable');

const { InputPin, OutputPin, IOPinEvents } = require('../base/io');
const { Expression } = require('../expression');
const { Switch } = require('../switch');
const { Call } = require('../call');

describe("*** fibonacci test ***", () => {
  it('should demonstrate the awesomeness of platform by calculating fibonacci function.', done => {
    let Fib = node({
      path: 'tests/fib',
      inputs: ['n'],
      outputs: ['res'],
    }, (inputs, output) => {
      let i = new Expression('n < 3', ['n']);
      let iv = new Expression('1');
      let is = new Switch(['false', 'true']);
      let nm1 = new Expression('n - 1', ['n']);
      let nm2 = new Expression('n - 2', ['n']);
      let p = new Expression('a + b', ['a', 'b']);
      let c1 = new Call('tests/fib');
      let c2 = new Call('tests/fib');

      let _in = new OutputPin();
      let _out = new InputPin();

      _in
        .connect(i.pins.in.n)
        .connect(nm1.pins.in.n)
        .connect(nm2.pins.in.n);
      i.pins.result.connect(is.pins.target);
      is.pins.cases['true'].connect(iv.pins.control);
      is.pins.cases['false']
              .connect(nm1.pins.control)
              .connect(nm2.pins.control);
      nm1.pins.result.connect(c1.pins.in.n);
      nm2.pins.result.connect(c2.pins.in.n);
      c1.pins.out.res.connect(p.pins.in.a);
      c2.pins.out.res.connect(p.pins.in.b);

      _out
        .connect(p.pins.result)
        .connect(iv.pins.result);

      _out.subscribe(IOPinEvents.receive, res => output('res', res));

      _in.send(inputs.n);
    });

    let fib = callable(Fib);
    fib({n : 7}).then(res => {
      assert.equal(res.data, 13);
      done();
    });
  });
});
