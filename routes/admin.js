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



function ensureAuthenticated(req, res, next) {
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
			
			if(user === null) {
				res.redirect('/admin');
			}

		if(user){
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

      getArtist(function(data) {

        data.map(function(d) {

          var today = new Date();
          var month = d.dateBirth.month;
          var day = d.dateBirth.day;
          var year = d.dateBirth.year;

          var dob = new Date(month + '/' + day + '/' + year);
          var age = today.getFullYear() - dob.getFullYear();

          var label = (d.approved) ? '<span class="label label-success">Approved</span>' : '<span class="label label-warning">Pending</span>';

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
            label: label,
            age: age,
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
          data: newObj,
          approvedArtists: approvedArtists,
          pendingArtists: pendingArtists,
					approvedArtistsNum: approvedArtistsNum,
					pendingArtistsNum: pendingArtistsNum
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



  router.get('/admin/logout', function(req, res) {
    req.session.authenticated = false;
    req.logout();
    res.redirect('/admin');
  });


  router.post('/approve_artist', function(req, res) {

    if (req.session.admin_authenticated) {

      var status = (req.body.approved === 'true') ? true : false;

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