/**
 * Module dependencies
 */
require('dotenv').load();
var express = require('express');
var router = new express.Router();
require('./uploadManager')(router);
require('./register')(router);
require('./events')(router);
require('./event')(router);
//require('./artist')(router);
require('./press')(router);
require('./whats_new')(router);
require('./artist_login')(router);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var getEvents = require('../models/get_events');
var Eventbrite = require('eventbrite');
var randtoken = require('rand-token');
var token = randtoken.generate(6);
var ebClient = new Eventbrite({
    'app_key': process.env.EVENTBRITE_APP_API,
    'user_key': process.env.EVENTBRITE_USER_API
});

var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}


var databaseUrl = connection_string;
var collections = ['admin_users', 'events'];
var db = require("mongojs").connect(databaseUrl, collections);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function findById(id, fn) {
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }
    return fn(null, null);
}
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(user, done) {
//     done(null, user);
// });
// passport.use(new LocalStrategy(function(username, password, done) {
//     // asynchronous verification, for effect...
//     process.nextTick(function() {
//         db.admin_users
//             .findOne({
//                 'username': username
//             }, function(err, user) {
//                 if (err) {
//                     return done(err);
//                 }
//                 if (!user) {
//                     return done(null, false, {
//                         message: 'Unknown user ' + username
//                     });
//                 }
//                 if (user.password !== password) {
//                     return done(null, false, {
//                         message: 'Invalid password'
//                     });
//                 }
//                 return done(null, user);
//             });
//     });
// }));


router.get('/', function(req, res) {

    db.events.find({}, function(err, events) {
        if (err || !events) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'conception events',
                data: JSON.stringify(events)
            });
        }
    });
});



router.get('/about', function(req, res) {
    res.render('about', {
        title: 'team'
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


module.exports = router;