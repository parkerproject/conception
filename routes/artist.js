const randtoken = require('rand-token');
const email = require('../email');
const getOrders = require('../models/get_orders');
const getEventsOnEventbrite = require('../models/get_events');
const getArtist_ticket = require('../models/get_artist_sold_all');
const AWS = require('aws-sdk');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

function deleteFile(file_name) {
  AWS.config.region = 'us-west-2';

  const s3obj = new AWS.S3({
    params: {
      Bucket: 'artistworks',
      Key: `artists_images/${file_name}`,
      Prefix: 'artists_images',
      ACL: 'public-read',
    },
  });

  s3obj.deleteObject((err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
}

function addhttp(url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = `http://${url}`;
  }
  return url;
}

function profileEventsTpl(date, eventid, status, title) {
  const html = [`<div class="switchWrapper"><span class="switch-title"><i>${date}</i>${title}</span>`,
    `<input id="${eventid}CheckboxSwitch" type="checkbox" value=${eventid} class="checkboxSwitch" ${status}>`,
    `<label for="${eventid}CheckboxSwitch"></label></div>`,
  ].join('');
  return html;
}

module.exports = function (router, db) {
  // view user profile ==============================
  router.get('/artist/:user_token', (req, res) => {
    db.artists.findOne({
      user_token: req.params.user_token,
    }, (err, user) => {
      if (err || !user) {
        console.log(err);
        res.redirect('/');
      } else {
        const eventlist = [];
        let turnOnTicketButton = false;
        let buyUrl;
        getEventsOnEventbrite((events) => {
          const eventsObject = JSON.parse(events);
          const liveEvents = eventsObject.events;

          liveEvents.forEach((liveEvent) => {
            if (user.events.indexOf(liveEvent.event.id) !== -1) {
              buyUrl = liveEvent.event.url;
              buyUrl = buyUrl.split('?')[0];
              buyUrl = `${buyUrl}?aff=${req.params.user_token}`;
              turnOnTicketButton = true;
            }
          });

          res.render('new/artist', {
            title: 'conception events',
            data: user,
            user_url: addhttp(user.url),
            turnOnTicketButton,
            buyUrl,
          });
        });
      }
    });
  });

  // processes the login for users=====================
  router.get('/login', (req, res) => {
    let listArr = '';


    getEventsOnEventbrite((events) => {
      const eventsObject = JSON.parse(events);
      const liveEvents = eventsObject.events;

      liveEvents.forEach((liveEvent) => {
        listArr += (`<option value='${liveEvent.event.id}'>${liveEvent.event.title} - ${liveEvent.event.start_date}</option>`);
      });

      res.render('new/login', {
        title: 'artist',
        message: req.query.error,
        options: listArr,
      });
    });
  });


  router.get('/artist_orders', (req, res) => {
    const event_id = req.query.event;

    getOrders(event_id, (orders) => {
      res.send(orders);
    });
  });

  router.get('/oneventbrites', (req, res) => {
    getEventsOnEventbrite((events) => {
      const eventsObject = JSON.parse(events);
      res.send(eventsObject.events);
    });
  });


  router.post('/artist_attendingevent', (req, res) => {
    console.log(req.body.user, req.body.event_id);
    if (req.session.authenticated || req.session.admin_authenticated) {
      db.artists.update({
        user_token: req.body.user,
      }, {
        $addToSet: {
          events: parseInt(req.body.event_id, 10),
        },
      }, (err, updateduser) => {
        console.log(updateduser);
        res.send(updateduser);
      });
    }
  });

  router.post('/artist_not_attendingevent', (req, res) => {
    console.log(req.body.user, req.body.event_id);
    if (req.session.authenticated || req.session.admin_authenticated) {
      db.artists.update({
        user_token: req.body.user,
      }, {
        $pull: {
          events: parseInt(req.body.event_id, 10),
        },
      }, (err, updateduser) => {
        console.log(updateduser);
        res.send(updateduser);
      });
    }
  });


  router.post('/login', (req, res) => {
    const email = req.body.username;

    db.artists.findOne({
      email: email.toLowerCase(),
      password: req.body.password,
    }, (err, user) => {
      if (err || !user) {
        res.redirect('/login?error=unknown user');
      } else {
        const totalTickets = !!((user.tickets !== 0 && user.approved === true));
        const soldAll = (user.tickets === 0);
        req.session.authenticated = true;


        getEventsOnEventbrite((events) => {
          const eventsObject = JSON.parse(events);
          const liveEvents = eventsObject.events;
          let status = '';
          let eventsHtml = '';

          liveEvents.forEach((liveEvent) => {
            status = (user.events.indexOf(liveEvent.event.id) !== -1) ? 'checked' : '';

            eventsHtml += profileEventsTpl(liveEvent.event.start_date, liveEvent.event.id, status, liveEvent.event.title);
          });


          res.render('edit_profile', {
            title: '',
            data: user,
            totalTickets,
            soldAll,
            numberOfEvents: user.events.length,
            eventsHtml,
          });
        });
      }
    });
  });


  router.get('/reset_password', (req, res) => {
    res.render('new/reset_password', {
      title: 'reset password',
    });
  });

  /** ***** artist search ********/
  router.get('/artist_search', (req, res) => {
    if (req.headers.referer != null) {
      db.artists.find({
        reserved: 'yes',
        approved: true,
      }, (err, users) => {
        const names = [];

        if (err) {
          console.log(err);
        }

        if (!users) {
          console.log('no users found');
        }

        if (users) {
          users.forEach((user) => {
            names.push(user.full_name);
          });
          res.send(names);
        }
      });
    } else {
      res.redirect('/');
    }
  });

  router.post('/artist_search', (req, res) => {
    if (req.body.query !== '') {
      const query = {
        full_name: new RegExp(req.body.query, 'i'),
      };


      db.artists.findOne(query, (err, artist) => {
        if (err) {
          console.log('search has no result');
        } else if (!artist) {
          const passedVariable = 'No artist with that name!';
          res.render('thank_you', {
            data: passedVariable,
          });
        } else {
          res.redirect(`/artist/${artist.user_token}`);
        }
      });
    } else {
      res.redirect('/');
    }
  });

  router.post('/reset_password', (req, res) => {
    const password = randtoken.generate(5);

    db.artists.findAndModify({
      query: {
        email: req.body.email,
      },
      update: {
        $set: {
          password,
        },
      },
      new: true,
    }, (err, doc, lastErrObj) => {
      if (err) {
        console.log(err);
      } else {
        email.sendNewPasswordEmail(doc.email, doc.full_name, doc.password);
      }
    });

    const passedVariable = 'Check your email for your new password!';
    res.render('new/thank_you', {
      data: passedVariable,
    });
  });


  // handles editing of artist profile =======================
  router.post('/artist_update', ensureAuthenticated, (req, res) => {
    if (req.url == '/artist_update') {
      const objForUpdate = {};

      if (req.files.artwork_1) {
        objForUpdate.artwork_1 = req.files.artwork_1.name;
        var oldArtwork_1 = req.body.artwork_1_hidden;
      }

      if (req.files.artwork_2) {
        objForUpdate.artwork_2 = req.files.artwork_2.name;
        var oldArtwork_2 = req.body.artwork_2_hidden;
      }

      if (req.files.artwork_3) {
        objForUpdate.artwork_3 = req.files.artwork_3.name;
        var oldArtwork_3 = req.body.artwork_3_hidden;
      }

      if (req.files.photo) {
        objForUpdate.photo = req.files.photo.name;
        var oldPhoto = req.body.photo_hidden;
      }

      if (req.body.my_story) objForUpdate.story = req.body.my_story;
      if (req.body.artist_facebook_url) objForUpdate.facebook_url = req.body.artist_facebook_url;
      if (req.body.artist_twitter_url) objForUpdate.twitter_url = req.body.artist_twitter_url;
      if (req.body.artist_instagram) objForUpdate.instagram = req.body.artist_instagram;
      if (req.body.artist_url) objForUpdate.url = req.body.artist_url;
      if (req.body.artist_music_url) objForUpdate.music_url = req.body.artist_music_url;
      if (req.body.artist_name) objForUpdate.full_name = req.body.artist_name;


      db.artists.findAndModify({

        query: {
          email: req.body.artist_email_hidden,
        },
        update: {
          $set: objForUpdate,
        },

      }, (err, user) => {
        if (err || !user) console.log('No user updated');
        else {
          if (oldArtwork_1 && oldArtwork_1 !== '') deleteFile(oldArtwork_1);
          if (oldArtwork_2 && oldArtwork_2 !== '') deleteFile(oldArtwork_2);
          if (oldArtwork_3 && oldArtwork_3 !== '') deleteFile(oldArtwork_3);
          if (oldPhoto && oldPhoto !== '') deleteFile(oldPhoto);

          res.redirect(`/artist/${req.body.artist_token}`);
        }
      });
    } else {
      res.redirect('/login');
    }
  });

  router.get('/get_artist_ticket', (req, res) => {
    console.log(req.query.user_token);

    getArtist_ticket(req.query.user_token, (user) => {
      console.log(user.tickets);

      res.json(user.tickets);
    });
  });


  return router;
};
