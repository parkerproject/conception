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
    res.redirect('/login');
}

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new LocalStrategy(function(email, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function() {
        db.artists.findOne({
            'email': email
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user email ' + username
                });
            }
            if (user.password !== password) {
                return done(null, false, {
                    message: 'Invalid password'
                });
            }
            return done(null, user);
        });
    });
}));


router.post('/artist_login', passport.authenticate('local', {
    failureRedirect: '/artist/login',
    failureFlash: true
}), function(req, res) {
    res.redirect('/edit-profile/' + req.body.user_token);
});

router.get('/edit-profile/:artist', ensureAuthenticated, function(req, res) {
    res.render('edit_profile', {
        title: '',
        data: ''
    });
});