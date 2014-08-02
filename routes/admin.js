/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */
var getEvents = require('../models/get_events');
var getArtist = require('../models/artists_list');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/admin');
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
      getArtist(function(data) {
        res.send(JSON.stringify(data));
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




  return router;

};