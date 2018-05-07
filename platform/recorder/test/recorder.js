const should = require('chai').should();

const { Subscribable } = require('../../core/base/subscribable');

const { Watcher } = require('../watcher');
const { Scenario } = require('../scenario');
const { Recorder } = require('../recorder');


describe('Recorder', () => {
  it('should record a given scenario in action', done => {
    class S extends Scenario {
      constructor() {
        super();
        this._subject = new Subscribable();
        this._events = { a : 'a', b : 'b' };
        this._watcher = new Watcher(this._events).watch(this._subject);
      }

      watcher() { return this._watcher; }
      start() {
        this._subject.publish(this._events.a);
        this._subject.publish(this._events.b);
        this.stop();

        return super.start();
      }
    };

    let recorder = new Recorder();

    recorder.finished(() => {
      recorder.recording[0].event.event.should.equal('a');
      recorder.recording[1].event.event.should.equal('b');
      done();
    });

    recorder.record(new S());
  });
});
