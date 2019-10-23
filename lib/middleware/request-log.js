/*
this middleware only display request body before calling route
 */
const logger = require('../logger/logger').logger(__filename);

module.exports = (req, res, next) => {
  logger.info(`${req.method} request in ${req.path}`);
  next();
};
