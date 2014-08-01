var db = require('../config/database.js');

module.exports = exports = function(fn) {
  var artists = [];
  db.events.find({}, function(err, events) {
    if (err || !events) console.log("No artist users found");

    else events.forEach(function(event) {
      artists.push(event.event_id, event.artists);
    });

    fn(artists);

  });
};