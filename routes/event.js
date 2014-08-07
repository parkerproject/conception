require('dotenv').load();

var db = require('../config/database');

function getEvent(id, fn) {
  db.events.findOne({
    event_id: id
  }, function(err, event) {
    if (err || !event) console.log(err);
    else fn(event);
  });
}



module.exports = function(router) {


  router.get('/event/:id', function(req, res) {
    var id = parseInt(req.params.id);
    db.artists.find({
      "events": id,
      approved: true
    }, function(err, artists) {
      if (err || !artists) {
        console.log(err);
      } else {
        getEvent(id, function(event) {
          res.render('event', {
            title: 'conception events',
            data: JSON.stringify(event),
            artists: artists,
            event_id: id
          });
        });
      }
    });

  });


  return router;
};