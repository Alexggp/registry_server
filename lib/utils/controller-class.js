const checkSchema = require('../middleware/check-schema');

class Controller {
  constructor(middlewares) {
    this.middlewareArray = (middlewares && !Array.isArray(middlewares))
      ? [middlewares] : middlewares || [];
  }

  insertMiddleware(midleware) {
    this.middlewareArray.push(midleware);
  }

  setInput(setParams) {
    this.insertMiddleware((req, res, next) => {
      const params = setParams(req, res);
      res.locals.params = params;
      next();
    });
  }

  validateSchema(schemaToValidate) {
    this.insertMiddleware(checkSchema(schemaToValidate));
  }

  getMiddlewaresArray() {
    return this.middlewareArray;
  }
}

module.exports = Controller;
