/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */
var getEvents = require('../models/get_events');
var getArtist = require('../models/artists_list');
var db = require('../config/database.js');
var _ = require('underscore');
var getEventOnEventbrite = require('../models/get_event');



function ensureAuthenticated(req, res, next) {
  console.log(req.session.admin_authenticated);
  if (req.session && req.session.admin_authenticated) {
    return next();
  }
  res.redirect('/admin');
}

function registration(fn) {
  db.artists.count(function(err, count) {
    fn(count);
  });
}

function sales(fn) {
  db.sales.count(function(err, count) {
    fn(count);
  });
}


function getEvent(email, fn) {
  db.events.find({
    artists: {
      $in: [email]
    }
  }, function(err, event) {
    if (err || !event) {
      console.log("No event found");
    } else {
      fn(event);
    }
  });
}


module.exports = function(router, passport, db) {

  /*************** admin routes ******************/
  router.get('/admin', function(req, res) {
    res.render('admin/login', {
      title: 'conception events login',
      message: req.flash('error')
    });
  });

  router.post('/admin/login', function(req, res) {

    db.admin_users.findOne({
      username: req.body.username,
      password: req.body.password
    }, function(err, user) {

      if (user === null) {
        res.redirect('/admin');
      }

      if (user) {
        req.session.admin_authenticated = true;
        res.redirect('/conception');
      }


    });

  });


  router.get('/conception/:name', ensureAuthenticated, function(req, res) {

    if (req.params.name == 'events') {
      getEvents(function(data) {
        res.send(data);
      });
    }



    if (req.params.name == 'artists') {


      var newObj = [];
      var eventsArr = [];
      var eventsHash = {};

      getEvents(function(events) {
        var liveEvents = JSON.parse(events);
        liveEvents = liveEvents.events;
        liveEvents.forEach(function(liveEvent) {
          var event_id = parseInt(liveEvent.event.id);
          eventsArr.push(event_id);
          eventsHash[liveEvent.event.id] = liveEvent.event.title;
        });

        db.artists.find({
          "events": {
            $in: eventsArr
          }
        }, function(err, artists) {
          if (err) console.log(err);
          if (artists) {


            artists.map(function(d) {

              var label = (d.approved) ? '<span class="label label-success">Approved</span>' : '<span class="label label-warning">Pending</span>';

              for (var i = 0, j = eventsArr.length; i < j; i++) {
                if (d.events.indexOf(eventsArr[i]) !== -1) {
                  d.event_name = eventsHash[eventsArr[i]];
                  break;
                }
              }

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


              newObj.push({
                artwork_1: d.artwork_1,
                artwork_2: d.artwork_2,
                artwork_3: d.artwork_3,
                dateBirth: d.dateBirth,
                email: d.email,
                full_name: d.full_name,
                photo: d.photo,
                url: d.url,
                events: d.events,
                event_name: d.event_name,
                label: label,
                approved: d.approved,
                genre: d.genre,
                tickets: d.tickets,
                user_token: d.user_token,
                password: d.password

              });
            });

            var approvedArtists = _.filter(newObj, function(artist) {
              return artist.approved === true;
            });

            var pendingArtists = _.filter(newObj, function(artist) {
              return artist.approved === false;
            });

            var approvedArtistsNum = _.size(approvedArtists);
            var pendingArtistsNum = _.size(pendingArtists);

            res.render('admin/artists', {
              title: 'artist',
              artists: newObj,
              approvedArtists: approvedArtists,
              pendingArtists: pendingArtists,
              approvedArtistsNum: approvedArtistsNum,
              pendingArtistsNum: pendingArtistsNum
            });
          }
        });
      });

    }

  });

  router.get('/conception', ensureAuthenticated, function(req, res) {

    db.artists.find({
      full_name: {
        $ne: 'test'
      }
    }).count(function(err, reg) {
      db.sales.count(function(err, sales) {

        res.render('admin/home', {
          title: 'Conception',
          sales: sales,
          registration: reg
        });
      });

    });

  });

  // ********************** new admin begins *************************
  router.get('/admin/conception_new', ensureAuthenticated, function(req, res) {

    var listHtml = '';

    getEvents(function(events) {
      var liveEvents = JSON.parse(events);
      liveEvents = liveEvents.events;


      res.render('admin/new_home', {
        title: 'conception events',
        html: liveEvents
      });

    });
  });



  router.get('/admin/event/:id', ensureAuthenticated, function(req, res) {

    var event_id = req.params.id;

    var listHtml = '';

    getEvents(function(events) {
      var liveEvents = JSON.parse(events);
      liveEvents = liveEvents.events;


      res.render('admin/event', {
        title: 'conception events',
        html: liveEvents
      });

    });
  });


  // **************************** new admin ends ******************************************	



  router.get('/admin/logout', function(req, res) {
    req.session.authenticated = false;
    req.session.admin_authenticated = false;
    req.logout();
    res.redirect('/admin');
  });


  router.post('/approve_artist', function(req, res) {

    if (req.session.admin_authenticated) {

      var status = (req.body.approved === 'true') ? true : false;

      // make sure to only approve current event, 

      db.artists.findAndModify({
        query: {
          email: req.body.email
        },
        update: {
          $set: {
            approved: status
          }
        },
        new: true
      }, function(err, doc, lastErrObj) {
        if (err) {
          console.log(err);
        } else {
          res.send('update successfully');
        }
      });
    }

  });



  router.post('/full_tickets', function(req, res) {

    if (req.session.admin_authenticated) {

      db.artists.findAndModify({
        query: {
          email: req.body.email
        },
        update: {
          $set: {
            tickets: Number(0)
          }
        },
        new: true
      }, function(err, doc, lastErrObj) {
        if (err) {
          console.log(err);
        } else {
          res.send('tickets paid in full');
        }
      });
    }

  });


  return router;

};