/*
  Here services are designed as independent code pieces to be used in different controllers
  and as many times as necessary.
  They perform asynchronous transactions such as database calls or external APIs calls.
*/

const request = require('request');
const logger = require('../../logger/logger').logger(__filename);
const config = require('../../../config/config');


const serviceName = 'Demo';

function worker(inputData, callback) {
  // Write your asyncrhonous code here

  // const url = 'http://localhost:900/forcederror'; // test url to force 500 error
  // const url = 'http://google.com/asdf3'; // test url to force 404 error
  const url = 'http://www.google.com';


  // Just an example async function to see how manage erorrs.
  request(url, (error, response, body) => {
    if (error) {
      logger.error(`error: ${error}`);
      // First argument of callback is the error.
      // This will be an object with status and error fields
      callback({ status: 500, error: error });
    } else if (response.statusCode !== 200) {
      callback({ status: response.statusCode, error: response.body });
    } else {
      // Print the response status code if a response was received
      logger.debug(`Request call statusCode: ${response.statusCode}`);
      // Returning just some simple data string because it is an example
      const data = `Demo service says: ${inputData.message}`;
      callback(null, data);
    }
  });
}


function entry(inputData, callback) {
  logger.debug(`${serviceName} service called`);
  worker(inputData, (err, result) => {
    if (err) logger.error(`${serviceName} service error ${err.status}: ${err.error}`);
    else logger.debug(`${serviceName} service successfuly completed`);
    callback(err, result);
  });
}

module.exports.entry = entry;
