require('dotenv').load();

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

var databaseUrl = connection_string;
var collections = ['events'];
var db = require("mongojs").connect(databaseUrl, collections);

module.exports = function(router) {


    router.get('/event/:id', function(req, res) {
        var id = parseInt(req.params.id);
        db.events.findOne({
            "event_id": id
        }, function(err, event) {
            if (err || !event) {
                console.log(err);
            } else {
                res.render('event', {
                    title: 'conception events',
                    data: JSON.stringify(event)
                });
            }
        });

        // var only_display = 'id,title,description,status,start_date,end_date,tickets,venue'
        // ebClient.event_get({
        //     only_display: only_display,
        //     id: req.params.id
        // }, function(err, data) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         var eventData = JSON.stringify(data);
        //         res.render('event', {
        //             data: eventData
        //         });
        //     }

        // });







    });


    return router;
};