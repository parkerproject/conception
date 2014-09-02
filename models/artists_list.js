var db = require('../config/database.js');

module.exports = exports = function(fn) {
  var artists = [];
	db.artists.find({$query: {}, $orderby: { _id : -1 }}, function(err, result) {
    if (err || !result) console.log("No artist users found");

    else result.forEach(function(artist) {
      artists.push(artist);
    });

    fn(artists);

	});
};

