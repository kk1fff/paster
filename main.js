var initingDb = require('./db.js').initDb();
initingDb.then(require('./web.js').startWeb);
