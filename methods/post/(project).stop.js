var Method = require('aeolus').Method;
var pg = require('pg');

var conString = require('../../util/DBUrl.js');

var projects = new Method();

var stop = function(subdomain) {
  //do something!
  console.log("stopping!");
};

var setRunning = function(user, subdomain, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('UPDATE Projects SET running = false WHERE user = ' + user + ' and subdomain = ' + subdomain, function(err, result) {
      if (err) {
        client.query('CREATE TABLE Projects (repo varchar(255) NOT NULL, user varchar(255) NOT NULL, subdomain varchar(255) NOT NULL, running boolean, PRIMARY KEY (subdomain))');
        callback();
      }
      done();
      callback();
    });
  });
};

projects.handle(function(request, response) {
  var subdomain = request.getParameter('project');
  setRunning(request.getUsername(), subdomain, function() {
    response.respondPlainText("Project Will Started");
    stop(subdomain);
  });
});

projects.setHasAuth(true);

module.exports = projects;
