var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}

var databaseUrl = connection_string;
var collections = ['artists', 'events'];
var db = require("mongojs").connect(databaseUrl, collections);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/artist/login');
}

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
});
passport.use(new LocalStrategy(function(username, password, done) {
  // asynchronous verification, for effect...
  process.nextTick(function() {
    passport.use(new LocalStrategy(
      function(username, password, done) {
        db.artists.findOne({
          email: username
        }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'Incorrect username.'
            });
          }
          if (!user.password) {
            return done(null, false, {
              message: 'Incorrect password.'
            });
          }
          return done(null, user);
        });
      }
    ));
  });
}));

module.exports = function(router) {

  router.get('/artist/login', function(req, res) {
    res.render('artist_login', {
      title: 'artist',
      message: req.flash('error')
    });
  });


  router.post('/artist_login', passport.authenticate('local', {
    failureRedirect: '/artist/login',
    failureFlash: true
  }), function(req, res) {

    db.artists.findOne({
      email: req.body.username
    }, function(err, user) {
      if (err || !user) console.log("No user found");
      else {
				console.log(user);
        res.render('edit_profile', {
          title: '',
          data: user
        });
      }
    });

  });

  router.get('/edit-profile', ensureAuthenticated, function(req, res) {
    res.render('edit_profile', {
      title: '',
      data: ''
    });
  });

  return router;
};