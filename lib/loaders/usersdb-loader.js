const logger = require('../logger/logger').logger(__filename);
const MongoConnector = require('../connectors/mongodb-connector');
const config = require('../../config/config');

function mongodbLoader(callback) {
  const mC = new MongoConnector(logger, 0, config.nosql.users);
  mC.init((err) => {
    if (err) {
      logger.error(`connection error at database ${config.nosql.users.uri}`);
      callback(err);
    } else {
      logger.info(`connected to database: "${config.nosql.users.uri}"`);
      callback();
    }
  });
}

module.exports = mongodbLoader;
