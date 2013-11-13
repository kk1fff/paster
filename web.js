var Q       = require('q'),
    express = require("express"),
    db      = require("./db.js");
var app = express();

app.use(express.logger());
app.use(express.json());
app.use(express.urlencoded());

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
  });
});

app.post('/api/paste', function(req, resp) {
  console.log('paste: ' + req.body.content);

  var deferred = db.storeDoc({ content: req.body.content,
                               username: req.body.username,
                               usermail: req.body.usermail });
  deferred.then(function(idx) {
    resp.end("ok: " + idx);
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
