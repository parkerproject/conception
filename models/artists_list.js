var db = require('../config/database.js');

module.exports = exports = function(fn) {
  var artists = [];
  db.artists.find({}, function(err, result) {
    if (err || !result) console.log("No artist users found");

    else result.forEach(function(artist) {
      artists.push(artist);
    });

    fn(artists);

  });
};