var Aeolus = require('aeolus');

Aeolus.auth(function(user, pass, callback) {
  callback(true);
});

Aeolus.createServer(8080);
