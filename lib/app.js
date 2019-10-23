const util = require('util');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const async = require('async');
const log4js = require('log4js');
const path = require('path');
const ejsEngine = require('ejs-mate');
const passport = require('passport');
require('./login/passport/local-auth');
const session = require('express-session');
const flash = require('connect-flash');

const config = require('../config/config'); // config file
const port = config.rest.port;


const loginRoutes = require('./login/index');

// DB loaders
const usersDB = require('./loaders/usersdb-loader');

const app = express();

const customResponse = require('./middleware/custom-response');
const logger = require('./logger/logger').logger(__filename);


const theAppLog = log4js.getLogger();
const requestLog = require('./middleware/request-log');

const theHTTPLog = morgan(':remote-addr - :method :url HTTP/:http-version :status :res[content-length] - :response-time ms', {
  stream: {
    write(str) {
      theAppLog.debug(str);
    },
  },
});


let started = false;

function start() {
  logger.info('Starting server, please wait...');

  app.set('views', path.join(__dirname, 'views'));
  app.engine('ejs', ejsEngine);
  app.set('view engine', 'ejs');

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.urlencoded({
    extended: true,
  }));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(theHTTPLog);
  app.use(methodOverride());
  app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
  });
  app.use(customResponse);
  app.use(requestLog);
  // app.use('/', express.static('public')); // for public contents


  app.use('/', loginRoutes);


  app.disable('x-powered-by');
  app.listen(port).on('error', (err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
  });

  const loaders = [usersDB];
  async.series(loaders,
    (err, result) => {
      if (err) {
        logger.error(util.format('Something went wrong in booting time (%s)', err));
        process.exit(1);
      } else {
        logger.info(`Server started at ports [${port}]`);
        started = true;
      }
    });
}

function active() {
  return started;
}

function stop() {
  process.exit(0);
}

exports.start = start;
exports.active = active;
exports.stop = stop;
