const core = require('../../core');


const reqHandler = factoryOrClass => {
  return (req, res) => {
    let params = req.body;
    Object.assign(params, req.params);

    core.callable(factoryOrClass)(params).then(result => {
      if (result.output && result.data) {
        let r = {};
        r[result.output] = result.data;
        res.json(r);
      }
      else if (result.control) {
        res.json(result.control);
      }
    }).catch(error => {
      res.status(error.status || 500).send(error.message);
    });
  };
};

module.exports = reqHandler;
