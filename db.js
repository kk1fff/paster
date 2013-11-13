var Q           = require('q'),
    crypto      = require('crypto'),
    MongoClient = require('mongodb').MongoClient,
    baseConv    = require('./base_conv.js').BaseConv(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        'yz1234567890');
var DB;

function pasteCollection() {
  return DB.collection('paste_collection');
}

exports.getDoc = function(idx) {
  var d = Q.defer();
  var cursor = pasteCollection().find({ idx: idx });
  cursor.nextObject(function(err, doc) {
    if (err) {
      d.reject(err);
    }
    console.log("doc: " + JSON.stringify(doc));
    d.resolve(doc);
  });
  return d.promise;
};

exports.storeDoc = function(docObj) {
  var d = Q.defer();
  crypto.randomBytes(16, function(err, buf) {
    if (err) {
      d.reject(err);
      return;
    }

    // Got random index, store the doc.
    var idx = baseConv.transformBuffer(buf);
    function dbCallback(err, doc) {
      if (err) {
        d.reject(err);
        return;
      }

      d.resolve(idx);
    }

    pasteCollection().insert({ idx: idx,
                               content:  docObj.content,
                               username: docObj.username,
                               usermail: docObj.usermail },
                             dbCallback);
  });

  return d.promise;
};

exports.initDb = function() {
  var deferred = Q.defer();
  MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
    if(err) {
      deferred.reject(err);
      return;
    }
    console.log('Database has been initialized.');
    DB = db;
    deferred.resolve();
  });
  return deferred.promise;
};
