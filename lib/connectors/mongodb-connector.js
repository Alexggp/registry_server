const Mongo = require('mongodb');

let retry = 1; let
  config;
const mongoPool = require('./mongodb-pool');

let log; let
  policy;

function MongoConnector(logger, retrying, dbConfig) {
  log = logger;
  policy = retrying;
  retry = retrying;
  config = dbConfig;
  this.client = null;
}

MongoConnector.prototype = {
  init(callback) {
    const self = this;
    if (retry-- < 0) return callback(new Error().statusCode = -1, null);

    const url = config.uri;


    Mongo.connect(url, config.options, (err, db) => {
      if (err) {
        log.error(err);
        return self.init(callback);
      }

      self.client = db;
      retry = config.retry;
      mongoPool.set(url, self);
      callback(null, db);

      db.on('close', () => {
        log.error(`Close event received at:${JSON.stringify(config)}`);
        mongoPool.remove(url);
        retry = policy;
        return self.init(callback);
      });
    });
  },
  findById(collectionName, id, callback) {
    const collection = this.client.collection(collectionName);
    const oId = Mongo.ObjectID(id);
    collection.findOne({ _id: oId }, (err, result) => {
      callback(err, result);
    });
  },
  findOne(collectionName, data, callback) {
    const collection = this.client.collection(collectionName);
    collection.findOne(data, (err, result) => {
      callback(err, result);
    });
  },
  find(collectionName, data, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    const collection = this.client.collection(collectionName);
    collection.find(data, options).toArray((err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, [].slice.call(result));
      }
    });
  },
  insert(collectionName, data, callback) {
    const collection = this.client.collection(collectionName);
    collection.insert(data, (err, result) => {
      callback(err, result);
    });
  },
  count(collectionName, callback) {
    this.client.collection(collectionName, (error, coll) => {
      coll.find({}, {}).count((err, count) => {
        callback(err, count);
      });
    });
  },
  countWithOptions(collectionName, options, callback) {
    this.client.collection(collectionName, (error, coll) => {
      coll.find(options, {}).count((err, count) => {
        callback(err, count);
      });
    });
  },
  new(collectionName, callback) {
    const options = {
      limit: -1,
      sort: { id: -1 },
    };
    this.client.collection(collectionName, (error, coll) => {
      coll.find({}, options).toArray((err, count) => {
        callback(err, ++count[0].id);
      });
    });
  },
  max(collection, field, callback) {
    const sort = {};
    sort[field] = -1;
    const options = {
      limit: -1,
      sort,
    };
    this.client.collection(collection, (error, coll) => {
      coll.find({}, options).toArray((err, count) => {
        callback(err, count[0][field]);
      });
    });
  },
  recno(collectionName, callback) {
    this.client.collection(collectionName, (error, coll) => {
      coll.count((err, count) => {
        callback(null, count);
      });
    });
  },
  update(collectionName, query, data, options, callback) {
    const collection = this.client.collection(collectionName);
    collection.update(query, data, options, (err, result) => {
      callback(err, result);
    });
  },
  remove(collectionName, query, callback) {
    const collection = this.client.collection(collectionName);
    collection.remove(query, (err, result) => {
      callback(err, result);
    });
  },
  delete(collectionName, callback) {
    const collection = this.client.collection(collectionName);
    collection.remove({}, (err, result) => {
      callback(err, result);
    });
  },
  findAndUpdate(collectionName, query, data, callback) {
    const collection = this.client.collection(collectionName);
    collection.update(query, data, (err, result) => {
      callback(err, result);
    });
  },
  rename(collectionName, newCollectionName, callback) {
    const collection = this.client.collection(collectionName);
    collection.rename(newCollectionName, { dropTarget: true }, (err, result) => {
      callback(err, result);
    });
  },
  drop(collectionName, callback) {
    const collection = this.client.collection(collectionName);
    collection.drop((err, result) => {
      callback(err, result);
    });
  },
  aggregate(collectionName, match, group, callback) {
    const collection = this.client.collection(collectionName);
    collection.aggregate(match, group, (err, result) => {
      callback(err, result);
    });
  },
  distinct(collectionName, qs, callback) {
    const collection = this.client.collection(collectionName);
    collection.distinct(qs, (err, result) => {
      callback(err, result);
    });
  },
  findAndModify(collectionName, query, so, replacement, options, callback) {
    const collection = this.client.collection(collectionName);
    collection.findAndModify(query, so, replacement, options, (error, result) => {
      // callback(err, result);
      collection.findOne(query, (err, item) => {
        callback(err, item);
      });
    });
  },
  insertMany(collectionName, data, callback) {
    const collection = this.client.collection(collectionName);
    collection.insertMany(data, (err, result) => {
      callback(err, result);
    });
  },
};
module.exports = MongoConnector;
