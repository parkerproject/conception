require('dotenv').load();


module.exports = function (router, db) {
  router.get('/events', (req, res) => {
    db.events.find({ $query: {}, $orderby: { _id: 1 } }, (err, events) => {
      if (err || !events) {
        console.log(err);
      } else {
        res.render('events', {
          title: 'conception events',
          data: JSON.stringify(events),
        });
      }
    });
  });


  return router;
};
