var Method = require('aeolus').Method;
var pg = require('pg');

var conString = require('../../util/DBUrl.js');

var projects = new Method();

var createProject = function(user, subdomain, repo, callback) {
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO Projects VALUES (' + repo + "," + user + "," + subdomain + ',false)', function(err, result) {
      if (err) {
        console.log(err);
        client.query('CREATE TABLE Projects (repo varchar(255) NOT NULL, user varchar(255) NOT NULL, subdomain varchar(255) NOT NULL, running boolean, PRIMARY KEY (subdomain))');
        done();
      }
      done();
      callback();
    });
  });
};

projects.handle(function(request, response) {
  createProject(request.getUsername, request.getParameter('name'), request.getParameter('repo'), function() {
    response.respondPlainText("Project Added");
  });
});

projects.setHasAuth(true);

module.exports = projects;
