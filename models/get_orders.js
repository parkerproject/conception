require('dotenv').load();
var Eventbrite = require('eventbrite');
var ebClient = Eventbrite({
    'app_key': process.env.EVENTBRITE_APP_API,
    'user_key': process.env.EVENTBRITE_USER_API
});

module.exports = exports = function(event_id, callback) {
	ebClient.event_list_attendees({id: event_id}, function(err, data) {
        if (err) {
					 console.log(err);
            callback(null);
        } else {
            callback(JSON.stringify(data));
        }

    });
};