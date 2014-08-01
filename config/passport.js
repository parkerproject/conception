var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport,db) {
	
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new LocalStrategy(function(username, password, done) {

    // asynchronous verification, for effect...
    process.nextTick(function() {

      passport.use(new LocalStrategy(function(username, password, done) {

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
      }));
    });
  }));
	

};