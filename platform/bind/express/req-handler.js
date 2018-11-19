const core = require('../../core');
const conventions = require('../../conventions');


const reqHandler = (factoryOrClass, signature) => {
  return (req, res) => {
    let params = {};

    if (signature && signature.inputs)
      for (let input of signature.inputs) {
        let candidate = req.header(input);
        if (candidate || typeof candidate == 'string')
          params[input] = candidate;
      }

    Object.assign(params, req.body);
    Object.assign(params, req.params);
    Object.assign(params, req.query);

    core.callable(factoryOrClass, {req, res})(params).then(result => {
      if (result.output) {
        let r = {};
        r[result.output] = result.data;
        res.status(200).json(r);
      }
      else if (result.control) {
        let status = 200;

        //TODO: move these to somewhere nicer.
        //
        if (result.control == conventions.controls._WrongInput) status = 400;
        if (result.control == conventions.controls._Unauthorized) status = 401;
        if (result.control == conventions.controls._Forbidden) status = 403;
        if (result.control == conventions.controls._NotFound) status = 404;
        if (result.control == conventions.controls._InternalError) status = 500;

        res.status(status).json(result.control);
      }
    }).catch(error => {
      res.status(error.status || 500).send(error.message);
    });
  };
};

module.exports = reqHandler;
