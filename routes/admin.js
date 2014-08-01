/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}


module.exports = function(router, passport) {

  /*************** admin routes ******************/
  router.get('/login', function(req, res) {
    res.render('admin/login', {
      title: 'conception events login',
      message: req.flash('error')
    });
  });

  router.get('/conception/:name', ensureAuthenticated, function(req, res) {
    getEvents(function(data) {
      res.render('admin/home', {
        title: 'Conception',
        data: data
      });
    });
  });

  router.get('/conception', ensureAuthenticated, function(req, res) {

    getEvents(function(data) {
      res.render('admin/home', {
        title: 'Conception',
        data: data
      });
    });
  });

  router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), function(req, res) {
    res.redirect('/conception');
  });

  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });




  return router;

};