var Method = require('aeolus').Method;
var pg = require('pg');

var conString = require('../../util/DBUrl.js');

var projects = new Method();

var findProjectsByUser = function(user, callback) {
  pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT * FROM Projects WHERE user = ' + user, function(err, result) {
    if(err) {
      client.query('CREATE TABLE Projects (repo varchar(255) NOT NULL, user varchar(255) NOT NULL, subdomain varchar(255) NOT NULL, running boolean, PRIMARY KEY (subdomain))');
      callback(false);
    }
    done();
    if (result.rows.length === 1) {
      callback(result.rows[0].running);
    } else {
      callback(false);
    }
  });
});
};

projects.handle(function(request,response) {
  findProjectsByUser(request.getUsername(), function(projects) {
    response.respondJSON(projects);
  });
});

projects.setHasAuth(true);

module.exports = projects;
