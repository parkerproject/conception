/**
 * Module dependencies
 */
require('dotenv').load();
var express = require('express');
var router = new express.Router();
var db = require('../config/database.js');
var passport = require('passport');
require('../config/passport')(passport, db);
require('./uploadManager')(router);
require('./register')(router, db);
require('./events')(router, db);
require('./event')(router);
require('./artist')(router, db);
require('./press')(router);
require('./whats_new')(router);
require('./admin')(router, passport, db);



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

  db.events.find({
    $query: {},
    $orderby: {
      _id: 1
    }
  }, function(err, events) {
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
  //console.log(req.headers.referer);
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

//eventbrite ticket purchase callback
router.get('/payment/:eid/:oid', function(req, res) {

  if (req.cookies.conception_event) {

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
  }else{
		res.send('Sorry no direct access to this page');
	}



});

// 2 tickets reservation callback
router.get('/verify_payment', function(req, res) {

  var artist = req.cookies.conception_reserve_artist;

  if (req.cookies.conception_reserve_artist) {
    db.artists.findAndModify({
      query: {
        user_token: artist
      },
      update: {
        $inc: {
          tickets: -2
        },
        reserved: 'yes'
      },
      new: true
    }, function(err, doc, lastErrObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('paypal payment successful');

        var passedVariable = 'Your account is now activated!';
        res.render('thank_you', {
          data: passedVariable
        });

      }

    });
  } else {
    res.send('Sorry no direct access to this page');
  }




});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;