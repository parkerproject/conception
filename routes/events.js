require('dotenv').load();
var getEvents = require('../models/get_events');

module.exports = function(router) {

    router.get('/events', function(req, res) {

        getEvents(function(data) {
            res.render('events', {
                title: 'conception events',
                data: data
            });
        });
    });


    return router;
};