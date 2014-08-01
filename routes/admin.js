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

  router.post('/admin/login', passport.authenticate('local', {
    failureRedirect: '/admin/login',
    failureFlash: true
  }), function(req, res) {

    db.admin_users.findOne({
      username: req.body.username,
      password: req.body.password
    }, function(err, user) {
      if (err || !user) console.log("No user found");
      else {
        res.redirect('/conception');
      }
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



  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });




  return router;

};