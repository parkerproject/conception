#!/bin/env node

/**
 * Module dependencies.
 */

var express = require('express'),
    path = require('path'),
    hbs = require('express-hbs'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    favicon = require('static-favicon'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    config = require('./config'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    routes = require('./routes');



var app = express();

/**
 * A simple if condtional helper for handlebars
 *
 * Usage:
 *   {{#ifvalue env value='development'}}
 *     do something marvellous
 *   {{/ifvalue}}
 * For more information, check out this gist: https://gist.github.com/pheuter/3515945
 */
hbs.registerHelper('ifvalue', function(conditional, options) {
    if (options.hash.value === conditional) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});


/**
 * Express configuration.
 */
app.locals.pretty = true;
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ipaddress', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');
app.engine('hbs', hbs.express3());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app
    .use(compress())
    .use(favicon())
    .use(logger('dev'))
    .use(cookieParser())
    .use(bodyParser())
    .use(methodOverride())
    .use(express.static(path.join(__dirname, 'public')))
    .use(multer({
        dest: 'public/artists_images'
    }))
    .use(session({
        secret: 'keyboard cat',
        saveUninitialized: true,
        resave: true
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use(flash())
    .use(routes)
    .use(function(req, res) {
        res.status(404).render('404', {
            title: 'Not Found :('
        });
    });


if (app.get('env') === 'development') {
    app.use(errorHandler());
}

app.listen(app.get('port'), app.get('ipaddress'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});