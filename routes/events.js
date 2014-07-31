require('dotenv').load();
var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

var databaseUrl = connection_string;
var collections = ['events'];
var db = require("mongojs").connect(databaseUrl, collections);

module.exports = function(router) {

    router.get('/events', function(req, res) {

        db.events.find({}, function(err, events) {
            if (err || !events) {
                console.log(err);
            } else {
                res.render('events', {
                    title: 'conception events',
                    data: JSON.stringify(events)
                });
            }
        });

    });


    return router;
};