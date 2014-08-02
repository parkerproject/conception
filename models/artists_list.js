var db = require('../config/database.js');

module.exports = exports = function(fn) {
  var artists = [];
  db.artists.find({}, function(err, artist) {
    if (err || !events) console.log("No artist users found");

    else events.forEach(function(artist) {
      artists.push(artist);
    });

    fn(artists);

  });
};