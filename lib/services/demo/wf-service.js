/*
  Here services are designed as independent code pieces to be used in different controllers
  and as many times as necessary.
  They perform asynchronous transactions such as database calls or external APIs calls.


  wfService is recomended only for complex services that make more than one asynchronous
  transaction.
  It is implemented with async waterfall:
    ·Waterfall executes functions in the array one by one
    ·One function jump to the next by calling the callback function.
    ·The first parameter is the error parameter.
        ·If an error is returned by a transaction you should call calback(error),
          passing error object (or not null) as first argument .
        ·When callback(error) is called the waterfall brakes and returns the error.
    ·In no error case, first argument (error argument) is null and the other arguments in the
      callback call are the input parameters of the next function.
    ·Functions in waterfall array must be declared with callback as last input parameter.
·For more info about waterfall: https://caolan.github.io/async/v3/docs.html#waterfall
*/
const async = require('async');
const logger = require('../../logger/logger').logger(__filename);
const config = require('../../../config/config');

const serviceName = 'DemoWF';

function getInputData(inputData, callback) {
  const data = {
    message: inputData.message,
  };
  callback(null, data);
}

function asyncTransaction(data, callback) {
  // Write your asyncrhonous code here

  /*
    someAsyncFunction(args, function(err,result){
      if (err){
        callback({status: 500, error: err});
      }else{
        callback(null, result);
      }
    });
  */


  const sentence = 'DemoWF service says';
  callback(null, data, sentence);
}

function adapter(data, sentence, callback) {
  /*
    Here you can see how data and sentence objects are passed from "asyncTransaction"
    function callback:
      callback(null, data, sentence);
    to "adapter" function input:
      function adapter(data, sentence, callback)
  */

  // Transform your code here
  const response = `${sentence}: ${data.message}`;
  callback(null, response);
}

function worker(inputData, callback) {
  async.waterfall([
    async.apply(getInputData, inputData),
    asyncTransaction,
    adapter,
  ],
  (err, result) => {
    callback(err, result);
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
