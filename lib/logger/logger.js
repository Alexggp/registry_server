const log4js = require('log4js');
const util = require('util');
const moment = require('moment');
const stackTrace = require('stack-trace');
const config = require('../../config/config');

log4js.configure(config.logger);
const logger = log4js.getLogger();
module.exports.logger = function (operationCode) {
  const customLogger = {};
  ['debug', 'info', 'warn', 'error', 'fatal', 'express'].forEach(
    (levelString) => {
      customLogger[levelString] = function (message) {
        const frame = stackTrace.get()[1];
        const line = frame.getLineNumber();
        const column = frame.getColumnNumber();
        const frameMethod = frame.getFunctionName();
        const method = frameMethod === null ? 'anonymous' : frameMethod;
        const operation = operationCode || 'NA';
        const formatedMessage = util.format('%s|[%s(%s,%s)]|[%s]|%s',
          process.pid, method, line, column, operation, message);
        if (levelString === 'express') {
          return `${moment().format('YYYY-MM-DDThh:mm:ssZZ')}|EXPRESS|${formatedMessage}`;
        }
        logger[levelString](formatedMessage);
      };
    },
  );
  return customLogger;
};
