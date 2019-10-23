const logger = require('../logger/logger').logger(__filename);
const validator = require('../utils/validator');


function validateRegister(register, schema, callback) {
  const result = validator.validate(register, schema);
  callback(result, register);
}

module.exports = schema => (req, res, next) => {
/*
  This middleware check the input params for route methods, located in res.locals.params
  in according with the route schema.
  Yoy can call it as many times as you want in the middleware array, so you can
  do validations wherever you want if you make the schema too.
*/

  validateRegister(res.locals.params, schema, (err, result) => {
    if (!err.valid) {
      logger.warn(`Validation error: ${JSON.stringify(err)}`);
      res.customResponse.badRequest(err);
    } else {
      logger.debug('Successful schema validation');
      next();
    }
  });
};
