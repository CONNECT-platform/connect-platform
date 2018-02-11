const base = require('../base');
const Expression = require('../expression');
const Link = require('../observable-link');
const Value = require('../value');
const Call = require('../call');
const Switch = require('../Switch');
const callable = require('../callable');
const registry = require('../registry');

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

  v.connect(li)
    .connect(lb);

  n1.connectInput('a', li)
    .connectResult(la);

  n2.connectInput('a', la)
    .connectInput('b', lb)
    .connectOutput('result', lo);

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

  v.connect(lia)
    .connect(lib);

  n.connectInput('a', lia)
    .connectResult(lo)
    .connectControl(lb);

  c.connectInput('str', lib)
    .connectResult(la);

  sw.connectTarget(la)
    .connectOutput("true", lb)
    .connectOutput("false", lerr);

  v.checkActivate();
}

test4();

//------------------------------------------------------\\

class FactNode extends base.Node {
  constructor(){
    super(['n'], ['result']);

    this.v = new Value("1");
    this.c = new Expression(['n'], "n > 1");
    this.pin = new Expression(['n'], "n - 1");
    this.rn = new Expression(['n', 'nf'], "n * nf");
    this.r = new Call('/test/fact/');
    this.sw = new Switch(["true", "false"]);

    this.il1 = new Link();
    this.il2 = new Link();
    this.il3 = new Link();
    this.c.connectInput('n', this.il1);
    this.pin.connectInput('n', this.il2);
    this.rn.connectInput('n', this.il3);

    this.c2sw = new Link();
    this.c.connectResult(this.c2sw);
    this.sw.connectTarget(this.c2sw);

    this.swt = new Link();
    this.sw.connectOutput("true", this.swt);
    this.r.connectControl(this.swt);

    this.swf = new Link();
    this.sw.connectOutput("false", this.swf);
    this.v.connectControl(this.swf);

    this.pin2r = new Link();
    this.pin.connectResult(this.pin2r);
    this.r.connectInput('n', this.pin2r);

    this.r2rn = new Link();
    this.r.connectOutput('result', this.r2rn);
    this.rn.connectInput('nf', this.r2rn);

    this.ol1 = new Link();
    this.v.connect(this.ol1);

    this.ol2 = new Link();
    this.rn.connectResult(this.ol2);
  }

  run(inputs, respond) {
    this.ol1.subscribe(res => respond('result', res));
    this.ol2.subscribe(res => respond('result', res));

    this.il1.activate(inputs.n);
    this.il2.activate(inputs.n);
    this.il3.activate(inputs.n);
  }
}

registry.register({
  path: '/test/fact/',
  inputs: ['n'], outputs: ['result'],
}, FactNode);

const testFact = () => {
  callable(FactNode)({n : 5}).then(_log);
}

testFact();
