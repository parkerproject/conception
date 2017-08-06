/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */


const getEvents = require('../models/get_events');
const getArtist = require('../models/artists_list');
const getArtistOrders = require('../models/get_orders');
const db = require('../config/database.js');
const _ = require('underscore');
const getEventOnEventbrite = require('../models/get_event');
const getEventsOnEventbrite = require('../models/get_events');
const rp = require('request-promise');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.admin_authenticated) {
    return next();
  }
  res.redirect('/');
}

function updateStatus(token, status) {
  db.artists.update({
    user_token: token,
  }, {
    $set: {
      approved: status,
    },
  }, (err, result) => {
    if (err) console.log(err);
    console.log('updated');
  });
}

function profileEventsTpl(date, eventid, status, title) {
  const html = [`<div class="upcoming-events"><span class="switch-title">${date} ` + `<strong>${title}</strong></span>`,
    `<input id="${eventid}" type="checkbox" value=${parseInt(eventid, 10)} class="checkboxSwitch" ${status}>`,
    `<label for="${eventid}CheckboxSwitch"></label></div>`,
  ].join('');
  return html;
}

module.exports = function (router, passport, db) {
  // ********************** new admin begins *************************
  router.get('/conception_new', ensureAuthenticated, (req, res) => {
    const listHtml = '';

    getEvents((events) => {
      let liveEvents = JSON.parse(events);
      liveEvents = liveEvents.events;

      res.render('admin/new_home', {
        title: 'conception events',
        html: liveEvents,
      });
    });
  });

  router.get('/event/:id', ensureAuthenticated, (req, res) => {
    const eventId = parseInt(req.params.id);
    getEventOnEventbrite(eventId, (event) => {
      res.render('admin/event', {
        title: JSON.parse(event).event.title,
        start_date: JSON.parse(event).event.start_date,
      });
    });
  });


  router.get('/artists', ensureAuthenticated, (req, res) => {
    db.artists.find({}, {
      full_name: 1,
      email: 1,
      approved: 1,
      genre: 1,
      user_token: 1,
    }, (err, people) => {
      if (err || !people) console.log(err);

      res.render('admin/artists', {
        sortedArtists: encodeURIComponent(JSON.stringify(people)),
      });
    });
  });

  router.post('/artist', ensureAuthenticated, (req, res) => {
    const status = (req.body.status === 'approve');
    const token = req.body.user_token;

    db.artists.update({
      user_token: token,
    }, {
      $set: { approved: status },
      // $addToSet: { events: { $each: req.body.checkboxSwitch } }
    }, (err, result) => {
      if (err) console.log(err);
      res.redirect('/conception_new');
    });
  });


  router.post('/event/artist', ensureAuthenticated, (req, res) => {
    const status = (req.body.status === 'approve');
    const token = req.body.user_token;

    db.artists_record.find({
      user_token: token,
      event_id: req.body.event_id,
    }).limit(1, (err, result) => {
      if (err) console.log(err);

      if (result.length === 1) {
        db.artists_record.update({
          user_token: token,
          event_id: req.body.event_id,
        }, {
          $set: {
            booker: req.body.booker,
            status_1: req.body.status_1,
            status_2: req.body.status_2,
            notes: req.body.notes,
          },
        }, (error, data) => {
          if (error) console.log(error);
          updateStatus(token, status);
          res.redirect('/conception_new');
        });
      } else {
        delete req.body.status;
        db.artists_record.save(req.body);
        updateStatus(token, status);
        res.redirect('/conception_new');
      }
    });
  });

  router.get('/:event/artist/:id', ensureAuthenticated, (req, res) => {
    const artist_id = req.params.id;
    const event = req.params.event;
    let tix_sold = 0;

    getArtistOrders(event, (orders) => {
      if (orders != null) {
        const attendees = JSON.parse(orders).attendees;

        const thisUser = _.filter(attendees, user => user.attendee.affiliate == artist_id);

        thisUser.forEach((e) => {
          tix_sold += e.attendee.quantity;
        });
      }

      db.artists.find({
        user_token: artist_id,
      }).limit(1, (err, data) => {
        if (err) console.log(err);

        db.artists_record.find({
          user_token: artist_id,
          event_id: event,
        }).limit(1, (err, result) => {
          let booker = '',
            status_1 = '',
            status_2 = '',
            notes = '';

          if (result.length !== 0) {
            booker = result[0].booker;
            status_1 = result[0].status_1;
            status_2 = result[0].status_2;
            notes = result[0].notes;
          }

          res.render('admin/artist', {
            full_name: data[0].full_name,
            url: data[0].url,
            badge: (tix_sold < 15) ? 'bg-red' : 'bg-green',
            tix_sold,
            user_token: data[0].user_token,
            photo: data[0].photo,
            genre: data[0].genre,
            check: (data[0].approved) ? 'checked' : '',
            uncheck: (!data[0].approved) ? 'checked' : '',
            event,
            booker,
            status_1,
            status_2,
            notes,
            email: data[0].email,
            pass: data[0].password,

          });
        });
      });
    });
  });


  router.get('/artist/:id', ensureAuthenticated, (req, res) => {
    const artist_id = req.params.id;

    db.artists.find({
      user_token: artist_id,
    }).limit(1, (err, data) => {
      if (err) console.log(err);

      getEventsOnEventbrite((events) => {
        const eventsObject = JSON.parse(events);
        const liveEvents = eventsObject.events;
        let status = '';
        let eventsHtml = '';

        liveEvents.forEach((liveEvent) => {
          status = (data[0].events.indexOf(liveEvent.event.id) > -1) ? 'checked' : '';

          eventsHtml += profileEventsTpl(liveEvent.event.start_date, liveEvent.event.id, status, liveEvent.event.title);
        });

        res.render('admin/artist', {
          full_name: data[0].full_name,
          url: data[0].url,
          user_token: data[0].user_token,
          photo: data[0].photo,
          genre: data[0].genre,
          check: (data[0].approved) ? 'checked' : '',
          uncheck: (!data[0].approved) ? 'checked' : '',
          email: data[0].email,
          pass: data[0].password,
          eventsHtml,

        });
      });
    });
  });
};
// **************************** new admin ends ******************************************
