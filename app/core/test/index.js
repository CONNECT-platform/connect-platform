const base = require('../base');
const Expression = require('../expression');
const Link = require('../observable-link');
const Value = require('../value');
const Call = require('../call');
const Switch = require('../Switch');
const callable = require('../callable');

const TestNode = require('./test-node');


const _log = res => console.log(res);

//------------------------------------------------------\\

const test1 = () => {
  let f = callable(TestNode);
  f({ a: 2, b: 3}).then(_log);
  f({ a: 2, b: 0}).then(_log);
  f().then(_log);
}

test1();

//------------------------------------------------------\\

const test2 = () => {
  let g = callable(() => new Expression(['a'], "a * 2"));
  g({a : 2}).then(_log);
}

test2();

//------------------------------------------------------\\

const test3 = () => {
  let li = new Link();
  let la = new Link();
  let lb = new Link();
  let lo = new Link().subscribe(_log);

  let v = new Value("3 * 2");
  let n1 = new Expression(['a'], "(a + 2)");
  let n2 = new Call('/core/test-1/');

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

const test4 = () => {
  let lia = new Link();
  let lib = new Link();
  let la = new Link();
  let lb = new Link();
  let lo = new Link().subscribe(_log);
  let lerr = new Link().subscribe(() => {console.log("NEEEIN!");});

  let v = new Value("'hellow'");
  let n = new Expression(['a'], "{id : a}");
  let c = new Expression(['str'], "str.length > 5");
  let sw = new Switch(["true", "false"]);

  v.connect(lia);
  v.connect(lib);

  n.connectInput('a', lia);
  n.connectResult(lo);
  n.connectControl(lb);

  c.connectInput('str', lib);
  c.connectResult(la);

  sw.connectTarget(la);
  sw.connectOutput("true", lb);
  sw.connectOutput("false", lerr);

  v.checkActivate();
}

test4();
