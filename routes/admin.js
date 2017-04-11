/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-08-01
 * Time: 02:48 AM
 * To change this template use Tools | Templates.
 */
const getEvents = require('../models/get_events');
const db = require('../config/database.js');
const _ = require('underscore');


function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.admin_authenticated) {
    return next();
  }
  return res.redirect('/admin');
}


module.exports = (router, passport, db) => {
  /** ************* admin routes ******************/
  router.get('/', (req, res) => {
    res.render('admin/login', {
      title: 'conception events login',
      message: req.flash('error'),
    });
  });

  router.post('/login', (req, res) => {
    db.admin_users.findOne({
      username: req.body.username,
      password: req.body.password,
    }, (err, user) => {
      if (user === null) {
        res.redirect('/');
      }

      if (user) {
        req.session.admin_authenticated = true;
        // res.redirect('/conception');
        res.redirect('/conception_new/');
      }
    });
  });


  router.get('/conception/:name', ensureAuthenticated, (req, res) => {
    if (req.params.name === 'events') {
      getEvents((data) => {
        res.send(data);
      });
    }


    if (req.params.name === 'artists') {
      const newObj = [];
      const eventsArr = [];
      const eventsHash = {};

      getEvents((events) => {
        let liveEvents = JSON.parse(events);
        liveEvents = liveEvents.events;
        liveEvents.forEach((liveEvent) => {
          const eventId = parseInt(liveEvent.event.id, 10);
          eventsArr.push(eventId);
          eventsHash[liveEvent.event.id] = liveEvent.event.title;
        });

        db.artists.find({
          events: {
            $in: eventsArr,
          },
        }).sort({
          _id: -1,
        }, (err, artists) => {
          if (err) { console.log(err); }
          if (artists) {
            artists.map((d) => {
              const label = (d.approved) ?
              '<span class="label label-success">Approved</span>' :
              '<span class="label label-warning">Pending</span>';

              for (let i = 0, j = eventsArr.length; i < j; i++) {
                if (d.events.indexOf(eventsArr[i]) !== -1) {
                  d.event_name = eventsHash[eventsArr[i]];
                  break;
                }
              }

              const monthNames = [];
              monthNames[1] = 'Jan';
              monthNames[2] = 'Feb';
              monthNames[3] = 'Mar';
              monthNames[4] = 'Apr';
              monthNames[5] = 'May';
              monthNames[6] = 'Jun';
              monthNames[7] = 'Jul';
              monthNames[8] = 'Aug';
              monthNames[9] = 'Sep';
              monthNames[10] = 'Oct';
              monthNames[11] = 'Nov';
              monthNames[12] = 'Dec';


              newObj.push({
                artwork_1: d.artwork_1,
                artwork_2: d.artwork_2,
                artwork_3: d.artwork_3,
                dateBirth: d.dateBirth,
                email: d.email,
                full_name: d.full_name,
                photo: d.photo,
                url: d.url,
                events: d.events,
                event_name: d.event_name,
                label,
                approved: d.approved,
                genre: d.genre,
                tickets: d.tickets,
                user_token: d.user_token,
                password: d.password,

              });
            });

            const approvedArtists = _.filter(newObj, artist => artist.approved === true);

            const pendingArtists = _.filter(newObj, artist => artist.approved === false);

            const approvedArtistsNum = _.size(approvedArtists);
            const pendingArtistsNum = _.size(pendingArtists);

            res.render('admin/artists', {
              title: 'artist',
              artists: newObj,
              approvedArtists,
              pendingArtists,
              approvedArtistsNum,
              pendingArtistsNum,
            });
          }
        });
      });
    }
  });

  router.get('/conception', ensureAuthenticated, (req, res) => {
    db.artists.find({
      full_name: {
        $ne: 'test',
      },
    }).count((err, reg) => {
      db.sales.count((error, sales) => {
        res.render('admin/home', {
          title: 'Conception',
          sales,
          registration: reg,
        });
      });
    });
  });


  router.get('/logout', (req, res) => {
    req.session.authenticated = false;
    req.session.admin_authenticated = false;
    req.logout();
    res.redirect('/');
  });


  router.post('/approve_artist', (req, res) => {
    if (req.session.admin_authenticated) {
      const status = (req.body.approved === 'true');

      // make sure to only approve current event,

      db.artists.findAndModify({
        query: {
          email: req.body.email,
        },
        update: {
          $set: {
            approved: status,
          },
        },
        new: true,
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send('update successfully');
        }
      });
    }
  });


  router.post('/full_tickets', (req, res) => {
    if (req.session.admin_authenticated) {
      db.artists.findAndModify({
        query: {
          email: req.body.email,
        },
        update: {
          $set: {
            tickets: Number(0),
          },
        },
        new: true,
      }, (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send('tickets paid in full');
        }
      });
    }
  });


  return router;
};
