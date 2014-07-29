require('dotenv').load();

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

console.log(connection_string);

var databaseUrl = connection_string;
var collections = ['artists, events'];
var db = require("mongojs").connect(databaseUrl, collections);

function getArtist(email, fn) {
    db.artists.findOne({
        email: email
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
                for (var i = 0; i < event.artists.length; i++) {
                    getArtist(event.artists[i], function(artist) {
                        artists.push(artist);
                    });
                }
                console.log('theses are the artists '+artists);
                res.render('event', {
                    title: 'conception events',
                    data: JSON.stringify(event),
                    artists: artists
                });
            }
        });

    });


    return router;
};