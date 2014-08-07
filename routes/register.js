#!/bin/env node

require('dotenv').load();
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var email = require('../email');



module.exports = function(router, db) {

  router.get('/register', function(req, res) {
    res.render('register', {
      data: 'parker'
    });
  });


  router.get('/thank_you', function(req, res) {
    var passedVariable = req.query.data;
    res.render('thank_you', {
      data: passedVariable
    });
  });



  router.post('/register', function(req, res) {

    var password = randtoken.generate(5),
      artwork_1_name = (req.files.hasOwnProperty('artwork_1')) ? req.files.artwork_1.name : '',
      artwork_2_name = (req.files.hasOwnProperty('artwork_2')) ? req.files.artwork_2.name : '',
      artwork_3_name = (req.files.hasOwnProperty('artwork_3')) ? req.files.artwork_3.name : '',
      photo = (req.files.hasOwnProperty('photo')) ? req.files.photo.name : '',
      event_id = parseInt(req.body.city);


    var userInfo = {
      full_name: req.body.name,
      password: password,
      email: req.body.email,
      user_token: randtoken.generate(10),
      emailVerified: false,
      approved: false,
      dateBirth: {
        month: req.body.birthMonth,
        day: req.body.birthDay,
        year: req.body.birthYear
      },
      genre: req.body.genre,
      url: req.body.url,
      artwork_1: artwork_1_name,
      artwork_2: artwork_2_name,
      artwork_3: artwork_3_name,
      photo: photo,
      story: '',
      facebook_url: '',
      twitter_url: '',
      instagram: '',
      googleplus: '',
      isAdmin: false,
			events: [event_id],
			tickets: 15,
			reserved: 'no'
    };

    db.artists.findOne({
      email: req.body.email
    }, function(err, result) {

      if (err) console.log('first error ' + err);
      if (result == null) {

        setTimeout(function() {
          db.artists.save(userInfo, function(err, result) {
            if (err) console.log('second error ' + err);
            if (result) console.log('Added!');

            var link = 'http://www.conceptionevents.com/verifyemail/user/' + userInfo.user_token;

            email.sendEmail(userInfo.email, userInfo.full_name, link);
            email.sendAdminEmail();

          });

          db.events.findAndModify({
            query: {
              event_id: event_id
            },
            update: {
              $addToSet: {
                artists: userInfo.email
              }
            },
            new: true
          }, function(err, doc, lastErrObj) {
            if (err) {
              console.log(err);
            } else {
              console.log('artist added to event: ' + doc);
            }
          });

          var string = encodeURIComponent('Thank you for submitting your work to Conception.');
          res.redirect('/thank_you?data=' + string);
        }, 0);
      } else {
        res.send('User already exist <a href="/">Back to Conception</a>');
      }
    });
  });


  router.get('/verifyemail/user/:token', function(req, res) {

    var token = req.params.token;

    db.artists.findAndModify({
      query: {
        user_token: token
      },
      update: {
        $set: {
          emailVerified: true
        }
      },
      new: true
    }, function(err, doc, lastErrObj) {
      if (err) {
        console.log(err);
      } else {

        email.sendPasswordEmail(doc.email, doc.full_name, doc.password);
      }
    });

    res.send('You account is now verified. Expect an email shortly <a href="/">Back to Conception</a>');
  });

  return router;
};