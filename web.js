var Q       = require('q'),
    express = require("express"),
    db      = require("./db.js");
var app = express();

app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());

var utils = {
  checkRequestText: function(data, max) {
    if (typeof data != 'string') return false;
    if (data.length == 0) return false;
    if (data.length > max) return false;
    return true;
  }
};

app.get(/\/([A-Za-z0-9]+)/, function(req, resp) {
  console.log('get: ' + req.params[0]);
  var d = db.getDoc(req.params[0]);
  d.then(function(doc) {
    if (doc) {
      resp.end(doc.content);
    } else {
      resp.statusCode = 404;
      resp.end('not found');
    }
  }, function(err) {
    console.error('read data error: ' + err);
    resp.statusCode = 500;
    resp.end('server error');
  });
});

app.post('/api/paste', function(req, resp) {
  console.log('paste: ' + req.body.content);

  if (!utils.checkRequestText(req.body.content, 256 * 1024) ||  // accept content up to 256k for now
      !utils.checkRequestText(req.body.username, 64) ||         // name up to 64 chars
      !utils.checkRequestText(req.body.usermail, 128)) {        // mail up to 128 chars
    resp.end("fail: input invalid");
    return;
  }

  var deferred = db.storeDoc({ content: req.body.content,
                               username: req.body.username,
                               usermail: req.body.usermail });
  deferred.then(function(idx) {
    resp.end("ok: " + idx);
  }, function(err) {
    console.error('error storing to database: ' + err);
    resp.end("fail: cannot store to database");
  });
});

exports.startWeb = function() {
  var port = process.env.PORT || 5000;
  var d = Q.defer();
  app.listen(port, function() {
    d.resolve();
    console.log("Listening on " + port);
  });
  return d.promise;
};
