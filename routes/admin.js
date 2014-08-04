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


function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/admin');
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

      if (err || !user) res.redirect('/admin');
      req.session.authenticated = true;
      res.redirect('/conception');

    });

  });


  router.get('/conception/:name', ensureAuthenticated, function(req, res) {

    if (req.params.name == 'events') {
      getEvents(function(data) {
        res.send(data);
      });
    }

    if (req.params.name == 'artists') {


      var newObj = [],
        eArtist = {};

      getArtist(function(data) {

        data.map(function(d) {

          eArtist = {
            artwork_1: d.artwork_1,
            artwork_2: d.artwork_2,
            artwork_3: d.artwork_3,
            dateBirth: d.dateBirth,
            email: d.email,
            full_name: d.full_name,
            photo: d.photo,
            url: d.url,
            approved: d.approved,
						title: ''

          };
					
//           getEvent(d.email, function(title) {
//             return function(d) {
//                   d.title = title[0].title;
//             }(d);

//           });

        });
				
        newObj.push(eArtist);
        res.send(eArtist);
      });

    }

  });

  router.get('/conception', ensureAuthenticated, function(req, res) {

    res.render('admin/home', {
      title: 'Conception'

    });

  });



  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });


  router.post('/approve_artist', function(req, res) {

    if (req.session.authenticated) {

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



  return router;

};