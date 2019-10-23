module.exports = {
  public_dir: '/Users/ariza/Documents/codigo/skmo-api/public',
  rest: {
    path: '/api',
    max_callers: 1000,
    port: process.env.PORT || 4000,
  },
  logger: {
    levels: {
      default: 'DEBUG',
    },
    appenders: [
      {
        category: '[all]',
        type: 'console',
        layout: {
          type: 'pattern',
          pattern: '%d{yyyy-MM-ddThh:mm:ssO}|%[%p%]|%m',
        },
      },
    ],
    replaceConsole: false,
  },
  nosql: {
    users: {
      uri: process.env.usersDB_uri ||'mongodb://localhost:27017/node-login',
      options: {
        keepAlive: 1,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 0,
        autoReconnect: true,
        useNewUrlParser: true
      },
    },
  },
};
