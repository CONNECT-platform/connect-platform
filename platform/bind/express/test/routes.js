const assert = require('assert');
const core = require('../../../core');
const routes = require('../routes');


describe('routes', () => {
  describe('.gatherPublicRoutes()', () => {
    it('should be gathering the signatures of all nodes flagged as public.', () => {
      core.node({path:'/test/bind/express/gpr/', public: true}, () => {});
      assert(routes.gatherPublicRoutes().filter(s => s.path == '/test/bind/express/gpr/').length > 0);
    });

    it('should not be gathering not public routes.', () => {
      core.node({path:'/test/bind/express/gprn/'}, () => {});
      assert.equal(routes.gatherPublicRoutes().filter(s => s.path == '/test/bind/express/gprn/').length, 0);
    });
  });
});
