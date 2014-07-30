require('dotenv').load();

require('dotenv').load();

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

var databaseUrl = connection_string;
var collections = ['artists', 'events'];
var db = require("mongojs").connect(databaseUrl, collections);

module.exports = function(router) {

    router.get('/artist/:user_token', function(req, res) {

        db.artists.findOne({
            "user_token": req.params.user_token
        }, function(err, user) {
            if (err || !user) {
                console.log(err);
                res.redirect('/');
            } else {
                console.log(user);
                res.render('artist', {
                    title: 'conception events',
                    data: user
                });
            }
        });

    });

    return router;

};