var pg = require('pg');

var getRepo = function(user, subdomain, callback) {
  pg.connect(conString, function(err, client, done) {
  if(err) {
    return console.error('error fetching client from pool', err);
  }
  client.query('SELECT repo FROM Projects WHERE user = ' + user + ' and subdomain = ' + subdomain, function(err, result) {
    if(err) {
      client.query('CREATE TABLE Projects (repo varchar(255) NOT NULL, user varchar(255) NOT NULL, subdomain varchar(255) NOT NULL, running boolean, PRIMARY KEY (subdomain))');
      callback([]);
    }
    done();
    if (result.rows.length == 1) {
      console.log(result.rows[0]);
      callback(result.rows[0]);
    }
  });
});
};

module.exports = getRepo;
