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

function buildHtml(obj) {
  var dateObj = new Date(obj.start_date);
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();

  var monthNames = [];
  monthNames[1] = 'Jan';
  monthNames[2] = 'Feb';
  monthNames[3] = 'Mar';
  monthNames[4] = 'Apr';
  monthNames[5] = 'May';
  monthNames[6] = 'Jun';
  monthNames[7] = 'Jul';
  monthNames[8] = 'Aug';
  monthNames[9] = 'Sep';
  monthNames[10] = 'Oct';
  monthNames[11] = 'Nov';
  monthNames[12] = 'Dec';
	
	var address = (obj.hasOwnProperty('venue')) ? obj.venue.address : ''; 

  var html = ['<div class="col-md-12 text-center post">',
    '<div class="col-md-6 text-left post-text">',
    '<h2><a href="/event/' + obj.id + '">' + obj.title + ' <i class="fa fa-long-arrow-right fah"></i></a></h2>',
    '<span class="address-text">' + address + '</span>',
    '<h3>' + day + ' <span>' + monthNames[month] + '</span></h3></div>',
    '<div class="col-md-6 post-img"><a href="/event/' + obj.id + '"><img src="' + obj.logo + '"></a></div></div>'
  ].join('');

  return html;
}


router.get('/', function(req, res) {

  var listHtml = '';

  getEvents(function(events) {
    var liveEvents = JSON.parse(events);
    liveEvents = liveEvents.events;

    liveEvents.forEach(function(event) {
      listHtml += buildHtml(event.event);
    });

    res.render('index', {
      title: 'conception events',
      html: listHtml
    });

  });

});



router.get('/about', function(req, res) {
  res.render('new/about', {
    title: 'team'
  });
});

router.get('/community', function(req, res) {
  res.render('new/community', {
    title: ''
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

  if (req.cookies.conception_event && req.cookies.conception_general_sale === 'no') {

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
  } else {
    res.send('Sorry no direct access to this page');
  }



});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});



module.exports = router;