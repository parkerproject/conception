/**
 * Module dependencies
 */
require('dotenv').load();
var express = require('express');
var router = new express.Router();
var db = require('../config/database.js');
var passport = require('../config/passport.js');
require('./uploadManager')(router);
require('./register')(router,db);
require('./events')(router,db);
require('./event')(router);
require('./artist')(router,passport, db);
require('./press')(router);
require('./whats_new')(router);



var getEvents = require('../models/get_events');
var randtoken = require('rand-token');
var token = randtoken.generate(6);




function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}





router.get('/', function(req, res) {

  db.events.find({}, function(err, events) {
    if (err || !events) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'conception events',
        data: JSON.stringify(events)
      });
    }
  });
});



router.get('/about', function(req, res) {
  res.render('about', {
    title: 'team'
  });
});

router.get('/gallery', function(req, res) {
  res.render('gallery', {
    title: 'gallery'
  });
});

router.get('/campus', function(req, res) {
  res.render('campus', {
    title: 'campus'
  });
});


router.get('/payment/:eid/:oid', function(req, res) {

  var sales = {
    order_id: req.params.oid,
    event_id: req.params.eid,
    artist: req.cookies.conception_artist,
    local_event: req.cookies.conception_event
  };

  db.sales.save(sales, function(err, saved) {
    if (err || !saved) {
      console.log("payment not saved");
    } else {
      console.log("payment saved");
      var string = encodeURIComponent('Thank you for purchasing a ticket to Conception Event. We look forward to seeing you at the show!');
      res.redirect('/thank_you?data=' + string);
    }
  });

});

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });



module.exports = router;