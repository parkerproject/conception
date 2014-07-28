// require('dotenv').load();
// var Eventbrite = require('eventbrite');
// var ebClient = Eventbrite({
//     'app_key': process.env.EVENTBRITE_APP_API,
//     'user_key': process.env.EVENTBRITE_USER_API
// });

// module.exports = exports = function(callback) {
//     ebClient.event_update({
//         "event_id": 12300225305,
//         "status": "deleted "
//     }, function(err, data) {
//         if (err) throw err;
//         callback(JSON.stringify(data));
//         console.log(data);
//     });
// };