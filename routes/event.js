require('dotenv').load();

var Eventbrite = require('eventbrite');
var ebClient = Eventbrite({
    'app_key': process.env.EVENTBRITE_APP_API,
    'user_key': process.env.EVENTBRITE_USER_API
});

module.exports = function(router) {


    router.get('/event/:id', function(req, res) {

        var only_display = 'id,title,description,status,start_date,end_date,tickets,venue'
        ebClient.event_get({
            only_display: only_display,
            id: req.params.id
        }, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                var eventData = JSON.stringify(data);
                res.render('event', {
                    data: eventData
                });
            }

        });







    });


    return router;
};