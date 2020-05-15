const express = require('express');
const bodyParser = require('body-parser');
const chai = require('chai');
const chaiHttp = require('chai-http');

const core = require('../../../core');
const reqHandler = require('../req-handler');


chai.use(chaiHttp);

describe('reqHandler()', () => {
  app = express();
  app.use(bodyParser.json());

  it('returns a function that responds to request using given node.', done => {
    let node = core.node({inputs: ['a'], outputs: ['b']}, (inputs, output) => {
                output('b', inputs.a + ' World!');
              });
    app.get('/1', reqHandler(node));
    chai.request(app).get('/1').send({a : 'Hellow'}).then(res => {
      res.status.should.equal(200);
      res.body.should.have.property('b');
      res.body.b.should.equal('Hellow World!');
      done();
    });
  });

  it('return func should handle url parameters as well.', done => {
    let node = core.node({inputs: ['a'], outputs: ['b']}, (inputs, output) => {
                output('b', inputs.a + ' World!');
              });
    app.get('/1/:a', reqHandler(node));
    chai.request(app).get('/1/Goodbye').send().then(res => {
      res.status.should.equal(200);
      res.body.should.have.property('b');
      res.body.b.should.equal('Goodbye World!');
      done();
    });
  });

  it('return func should also handle control outputs.', done => {
    let node = core.node({controlOutputs: ['c']}, (i, o, control) => {
      control('c');
    });
    app.get('/2', reqHandler(node));
    chai.request(app).get('/2').send().then(res => {
      res.status.should.equal(200);
      res.body.should.equal('c');
      done();
    });
  });

  it('return func should respond 400 when input is not given.', done => {
    let node = core.node({inputs: ['a'], outputs: ['b']}, (i, o) => {
      console.log('clall');
      o(i.a);
    });
    app.get('/3', reqHandler(node));
    chai.request(app).get('/3').send().then(result => {
      result.status.should.equal(400);
      done();
    });
  })
});
