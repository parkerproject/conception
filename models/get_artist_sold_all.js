var db = require('../config/database.js');

module.exports = exports = function(user_token, fn) {
  var artists = [];
  db.artists.findOne({
    user_token: user_token
  }, function(err, result) {
    if (err || !result) console.log("No artist users found");

    if (result) fn(result);

  });
};