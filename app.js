#!/bin/env node

/**
 * Module dependencies.
 */
require('dotenv').load()

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
  flash = require('connect-flash'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  multer = require('multer'),
  routes = require('./routes')

var app = express()
var qt = require('quickthumb')
global.appRoot = path.resolve(__dirname)
require('./routes/watcher')

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
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
})

hbs.registerHelper('formatDate', function (date) {
  // This guard is needed to support Blog Posts without date
  // the takeway point is that custom helpers parameters must be present on the context used to render the templates
  // or JS error will be launched
  if (typeof (date) == 'undefined') {
    return 'Unknown'
  }

  var _date = new Date(date)
    // These methods need to return a String
  return _date.getUTCMonth() + '/' + _date.getFullYear()
})

/**
 * Express configuration.
 */
app.locals.pretty = true
app.set('port', 8080)
app.set('ipaddress', '0.0.0.0')
app.engine('hbs', hbs.express3())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app
  .use(favicon(__dirname + '/public/favicon.ico'))
  .use(compress())
  .use(logger('dev'))
  .use(cookieParser())
  .use(bodyParser({
    limit: '150mb'
  }))
  .use(methodOverride())
  .use('/artists_images', qt.static('https://artistworks.s3-us-west-2.amazonaws.com/artists_images'))
  .use(express.static(path.join(__dirname, 'public')))
  .use(multer({
    dest: appRoot + '/public/artists_images/'
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
  .use(function (req, res) {
    res.status(404).render('404', {
      title: 'Not Found :('
    })
  })

if (app.get('env') === 'development') {
  app.use(errorHandler())
}

app.listen(app.get('port'), app.get('ipaddress'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})