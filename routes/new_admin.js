/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */
'use strict'
var getEvents = require('../models/get_events')
var getArtist = require('../models/artists_list')
var getArtistOrders = require('../models/get_orders')
var db = require('../config/database.js')
var _ = require('underscore')
var getEventOnEventbrite = require('../models/get_event')
var rp = require('request-promise')

function ensureAuthenticated (req, res, next) {
  console.log(req.session.admin_authenticated)
  if (req.session && req.session.admin_authenticated) {
    return next()
  }
  res.redirect('/admin')
}

function updateStatus (token, status) {
  db.artists.update({
    user_token: token
  }, {
    $set: {
      approved: status
    }
  }, function (err, result) {
    if (err) console.log(err)
    console.log('updated')
  })
}

module.exports = function (router, passport, db) {
  // ********************** new admin begins *************************
  router.get('/admin/conception_new', ensureAuthenticated, function (req, res) {
    var listHtml = ''

    getEvents(function (events) {
      var liveEvents = JSON.parse(events)
      liveEvents = liveEvents.events

      res.render('admin/new_home', {
        title: 'conception events',
        html: liveEvents
      })
    })
  })

  router.get('/admin/event/:id', ensureAuthenticated, function (req, res) {
    var event_id = parseInt(req.params.id)
    var artistArr = []

    db.artists.find({
      'events': event_id
    }).sort({
      _id: -1
    }, function (err, people) {
      if (err || !people) console.log(err)

      db.artists_record.find({
        'event_id': String(event_id)
      }, function (err, records) {
        if (err) console.log(err)

        people.forEach(function (person) {
          records.forEach(function (record) {
            if (record.user_token === person.user_token && record.event_id === String(event_id)) {
              person.record = record
            }
            artistArr.push(people)
            //  if (people.record) console.log(people.record.booker)

          })
        })

        getEventOnEventbrite(event_id, function (event) {
          res.render('admin/event', {
            title: JSON.parse(event).event.title,
            start_date: JSON.parse(event).event.start_date,
            sortedArtists: people,
            event_id: event_id
          })
        })
      })
    })
  })

  router.post('/admin/event/artist', ensureAuthenticated, function (req, res) {
    var status = (req.body.status == 'approve') ? true : false
    var token = req.body.user_token

    db.artists_record.find({
      user_token: token,
      event_id: req.body.event_id
    }).limit(1, function (err, result) {
      if (err) console.log(err)

      if (result.length === 1) {
        db.artists_record.update({
          user_token: token,
          event_id: req.body.event_id
        }, {
          $set: {
            booker: req.body.booker,
            status_1: req.body.status_1,
            status_2: req.body.status_2,
            notes: req.body.notes
          }
        }, function (error, data) {
          if (error) console.log(error)
          updateStatus(token, status)
          res.redirect('/admin/conception_new')
        })
      } else {
        delete req.body.status
        db.artists_record.save(req.body)
        updateStatus(token, status)
        res.redirect('/admin/conception_new')
      }
    })
  })

  router.get('/admin/:event/artist/:id', ensureAuthenticated, function (req, res) {
    var artist_id = req.params.id
    var event = req.params.event
    var tix_sold = 0

    getArtistOrders(event, function (orders) {
      if (orders != null) {
        var attendees = JSON.parse(orders).attendees

        var thisUser = _.filter(attendees, function (user) {
          return user.attendee.affiliate == artist_id
        })

        thisUser.forEach(function (e) {
          tix_sold += e.attendee.quantity
        })
      }

      db.artists.find({
        'user_token': artist_id
      }).limit(1, function (err, data) {
        if (err) console.log(err)

        db.artists_record.find({
          'user_token': artist_id,
          'event_id': event
        }).limit(1, function (err, result) {
          var booker = '',
            status_1 = '',
            status_2 = '',
            notes = ''

          if (result.length !== 0) {
            booker = result[0].booker
            status_1 = result[0].status_1
            status_2 = result[0].status_2
            notes = result[0].notes
          }

          res.render('admin/artist', {
            full_name: data[0].full_name,
            url: data[0].url,
            badge: (tix_sold < 15) ? 'bg-red' : 'bg-green',
            tix_sold: tix_sold,
            user_token: data[0].user_token,
            photo: data[0].photo,
            genre: data[0].genre,
            check: (data[0].approved) ? 'checked' : '',
            uncheck: (!data[0].approved) ? 'checked' : '',
            event: event,
            booker: booker,
            status_1: status_1,
            status_2: status_2,
            notes: notes,
            email: data[0].email,
            pass: data[0].password

          })
        })
      })
    })
  })
}
// **************************** new admin ends ******************************************
