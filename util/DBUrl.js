var fs = require('fs');

/**
 * Return url of the DB
 * @return {String} [url of DB]
 */
var getUrl = function() {
  var data = fs.readFileSync('database.json');
  data = JSON.parse(data);
  return "postgres://" + data.username + ":" + data.password + "@" + data.url;
};

module.exports = getUrl();
