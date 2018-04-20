const core = require('../../core');


const reqHandler = factoryOrClass => {
  return (req, res) => {
    let params = req.body;
    Object.assign(params, req.params);
    Object.assign(params, req.query);

    core.callable(factoryOrClass)(params).then(result => {
      if (result.output) {
        let r = {};
        r[result.output] = result.data;
        res.status(200).json(r);
      }
      else if (result.control) {
        res.status(200).json(result.control);
      }
    }).catch(error => {
      res.status(error.status || 500).send(error.message);
    });
  };
};

module.exports = reqHandler;
