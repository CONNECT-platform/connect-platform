const base = require('./base');
const Expression = require('./expression');
const Link = require('./observable-link');
const Value = require('./value');

const callable = require('./callable');


const _log = res => console.log(res);

class TestNode extends base.Node {
  constructor() {
    super(['a', 'b'], ['result', 'dont-like-zero', 'bad-params']);
  }

  run(inputs, respond) {
    if (inputs.a != undefined && inputs.b != undefined) {
      if (inputs.b == 0) respond('dont-like-zero');
      else respond('result', {
        winner: inputs.a,
        loser: inputs.b,
      });
    }
    else respond('bad-params');
  }
}

//------------------------------------------------------\\

const test1 = () => {
  var f = callable(() => new TestNode());
  f({ a: 2, b: 3}).then(_log);
  f({ a: 2, b: 0}).then(_log);
  f().then(_log);
}

test1();

//------------------------------------------------------\\

const test2 = () => {
  var g = callable(() => new Expression(['a'], "a * 2"));
  g({a : 2}).then(_log);
}

test2();

//------------------------------------------------------\\

const test3 = () => {
  var li = new Link();
  var la = new Link();
  var lb = new Link();
  var lo = new Link().subscribe(_log);

  var v = new Value("3 * 2");
  var n1 = new Expression(['a'], "(a + 2)");
  var n2 = new TestNode();

  v.connect(li);
  v.connect(lb);

  n1.connectInput('a', li);
  n1.connectResult(la);

  n2.connectInput('a', la);
  n2.connectInput('b', lb);
  n2.connectOutput('result', lo);

  v.checkActivate();
}

test3();

//------------------------------------------------------\\
