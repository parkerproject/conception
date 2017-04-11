#!/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').load();

const express = require('express');
const path = require('path');
const hbs = require('express-hbs');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const favicon = require('static-favicon');
const methodOverride = require('method-override');
const errorHandler = require('errorhandler');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const routes = require('./routes');
const app = express();
const qt = require('quickthumb');
global.appRoot = path.resolve(__dirname);
require('./routes/watcher');

/**
 * A simple if condtional helper for handlebars
 *
 * Usage:
 *   {{#ifvalue env value='development'}}
 *     do something marvellous
 *   {{/ifvalue}}
 * For more information, check out this gist: https://gist.github.com/pheuter/3515945
 */
hbs.registerHelper('ifvalue', function (conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this);
  }
  return options.inverse(this);
});

hbs.registerHelper('formatDate', (date) => {
  // This guard is needed to support Blog Posts without date
  // the takeway point is that custom helpers parameters must be present on the context used to render the templates
  // or JS error will be launched
  if (typeof (date) === 'undefined') {
    return 'Unknown';
  }

  const _date = new Date(date);
  // These methods need to return a String
  return `${_date.getUTCMonth()}/${_date.getFullYear()}`;
});

/**
 * Express configuration.
 */
app.locals.pretty = true;
app.set('port', 8080);
app.set('ipaddress', '0.0.0.0');
app.engine('hbs', hbs.express3());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(`${__dirname}/public/favicon.ico`));
app.use(compress());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser({
  limit: '150mb',
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use('/artists_images', qt.static('https://artistworks.s3-us-west-2.amazonaws.com/artists_images'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({
  dest: `${appRoot}/public/artists_images/`,
}));
app.use(session({
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(routes);
// app.use(function (req, res) {
//   res.status(404).render('404', {
//     title: 'Not Found :('
//   })
// })

if (app.get('env') === 'development') {
  app.use(errorHandler());
}

app.listen(app.get('port'), app.get('ipaddress'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});
