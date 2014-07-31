require('dotenv').load();

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

var databaseUrl = connection_string;
var collections = ['artists', 'events'];
var db = require("mongojs").connect(databaseUrl, collections);

function getArtist(email, fn) {
  db.artists.findOne({
    email: email,
    emailVerified: true
  }, function(err, user) {
    if (err || !user) console.log("No user found");
    else fn(user);
  });
}

module.exports = function(router) {


  router.get('/event/:id', function(req, res) {
    var id = parseInt(req.params.id);
    db.events.findOne({
      "event_id": id
    }, function(err, event) {
      if (err || !event) {
        console.log(err);
      } else {

        var artists = [];

        event.artists.map(function(artist) {
          getArtist(artist, function(details) {
						var e =JSON.stringify(details);
            artists.push(e);
          });
        });
        setTimeout(function() {
          res.render('event', {
            title: 'conception events',
            data: JSON.stringify(event),
            artists: artists,
						artistsData: artists
          });
        }, 0);

      }
    });

  });


  return router;
};