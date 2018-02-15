const assert = require('assert');
const base = require('../base');
const { Switch } = require('../switch');


describe('Switch', ()=> {
  it('should have a controller pin for each given case.', () => {
    let s = new Switch(['2 + 3', '1.5 * 2']);

    assert(s.pins.cases['2 + 3'] instanceof base.control.ControllerPin);
    assert(s.pins.cases['1.5 * 2'] instanceof base.control.ControllerPin);
  });

  it('should activate proper control pin based on given input', done => {
    let s = new Switch(['4.5 * 2', '9 / 2']);
    let c1 = new base.control.ControlPin()
                  .connect(s.pins.cases['4.5 * 2'])
                  .subscribe(base.pin.PinEvents.activate, () => {done()});
    let c2 = new base.control.ControlPin()
                  .connect(s.pins.cases['9 / 2'])
                  .subscribe(base.pin.PinEvents.activate, () => {done('wrong!')});

    s.pins.target.receive(9);
  });
});
