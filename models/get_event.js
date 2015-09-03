require('dotenv').load();
var Eventbrite = require('eventbrite');
var ebClient = Eventbrite({
  'app_key': process.env.EVENTBRITE_APP_API,
  'user_key': process.env.EVENTBRITE_USER_API
});

module.exports = exports = function(event_id, callback) {
  //var only_display = 'id,title,description,status,start_date,end_date,tickets,venue';
  ebClient.event_get({
    //only_display: only_display,
    id: event_id
  }, function(err, data) {
    if (err) {
      callback(JSON.stringify(err));
    } else {
      callback(JSON.stringify(data));
    }

  });
};