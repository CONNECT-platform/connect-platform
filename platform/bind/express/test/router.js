const express = require('express');
const bodyParser = require('body-parser');
const chai = require('chai');
const chaiHttp = require('chai-http');
const core = require('../../../core');
const router = require('../router');


chai.use(chaiHttp);

describe('router', () => {
  app = express();
  app.use(bodyParser.json());

  it('should build an express router that handles all public nodes with proper methods.', done => {
    core.node({path: '/test/bind/express/router/A',
              public: true,
              method: 'get',
              controlOutputs: ['done'],
            }, (i, o, c) => { c('done'); });
    core.node({path: '/test/bind/express/router/B',
              public: true,
              method: 'post',
              controlOutputs: ['done'],
            }, (i, o, c) => { c('done'); });
    core.node({path: '/test/bind/express/router/C',
              public: true,
              method: 'put',
              controlOutputs: ['done']
            }, (i, o, c) => { c('done'); });
    core.node({path: '/test/bind/express/router/D',
              public: true,
              method: 'delete',
              controlOutputs: ['done']
            }, (i, o, c) => { c('done'); });
    
    app.use(router());
    Promise.all([
      chai.request(app).get('/test/bind/express/router/A').send(),
      chai.request(app).post('/test/bind/express/router/B').send(),
      chai.request(app).put('/test/bind/express/router/C').send(),
      chai.request(app).delete('/test/bind/express/router/D').send(),
    ])
    .then(() => { done(); })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  });
});
