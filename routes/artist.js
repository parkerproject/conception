var randtoken = require('rand-token');
var email = require('../email');
var fs = require('fs');

function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

function deleteFile(file) {
  fs.unlink(process.env.OPENSHIFT_DATA_DIR + '/artists_images/' + file, function(err) {
    if (err) console.log(err);
    console.log('successfully deleted ' + file);
  });
}


module.exports = function(router, db) {

  // view user profile ==============================
  router.get('/artist/:user_token', function(req, res) {

    db.artists.findOne({
      "user_token": req.params.user_token
    }, function(err, user) {
      if (err || !user) {
        console.log(err);
        res.redirect('/');
      } else {
        res.render('artist', {
          title: 'conception events',
          data: user
        });
      }
    });

  });

  // processes the login for users=====================
  router.get('/login', function(req, res) {
    res.render('artist_login', {
      title: 'artist',
      message: req.query.error
    });
  });




  router.post('/login', function(req, res) {

    var email = req.body.username;

    db.artists.findOne({
      email: email.toLowerCase(),
      password: req.body.password
    }, function(err, user) {
      if (err || !user) {
        res.redirect('/login?error=unknown user');
      } else {
        var showActivate = (user.approved && user.reserved === 'no') ? true : false;
				var totalTickets = (user.tickets !== 0 && user.reserved === 'yes')? true : false;
				var amount = (user.tickets) * 15;

        req.session.authenticated = true;
        res.render('edit_profile', {
          title: '',
          data: user,
          showActivate: showActivate,
					totalTickets: totalTickets,
					amount: amount
					
        });
      }

    });

  });


  router.get('/reset_password', function(req, res) {
    res.render('reset_password', {
      title: 'reset password'
    });
  });

  /******* artist search ********/
  router.get('/artist_search', function(req, res) {

    if (req.headers.referer != null) {

      db.artists.find({
        reserved: 'yes',
        approved: true
      }, function(err, users) {

        var names = [];

        if (err) {
          console.log(err);
        }

        if (!users) {
          console.log('no users found');
        }

        if (users) {
          users.forEach(function(user) {
            names.push(user.full_name);
          });
          res.send(names);
        }

      });
    } else {
      res.redirect('/');
    }


  });

  router.post('/artist_search', function(req, res) {

    if (req.body.query !== '') {

      var query = {
        full_name: new RegExp(req.body.query, 'i')
      };


      db.artists.findOne(query, function(err, artist) {

        if (err) {
          console.log('search has no result');

        } else if (!artist) {

          var passedVariable = 'No artist with that name!';
          res.render('thank_you', {
            data: passedVariable
          });

        } else {
          res.redirect('/artist/' + artist.user_token);
        }

      });
    }else{
			res.redirect('/event/12420440873');
		}


  });

  router.post('/reset_password', function(req, res) {

    var password = randtoken.generate(5);

    db.artists.findAndModify({
      query: {
        email: req.body.email
      },
      update: {
        $set: {
          password: password
        }
      },
      new: true
    }, function(err, doc, lastErrObj) {
      if (err) {
        console.log(err);
      } else {

        email.sendNewPasswordEmail(doc.email, doc.full_name, doc.password);
      }
    });

    var passedVariable = 'Check your email for your new password!';
    res.render('thank_you', {
      data: passedVariable
    });


  });



  // handles editing of artist profile =======================
  router.post('/artist_update', ensureAuthenticated, function(req, res) {

    if (req.url == '/artist_update') {


      var objForUpdate = {};

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


      db.artists.findAndModify({

        query: {
          email: req.body.artist_email_hidden
        },
        update: {
          $set: objForUpdate
        }

      }, function(err, user) {
        if (err || !user) console.log("No user updated");
        else {

          if (oldArtwork_1 && oldArtwork_1 !== '') deleteFile(oldArtwork_1);
          if (oldArtwork_2 && oldArtwork_2 !== '') deleteFile(oldArtwork_2);
          if (oldArtwork_3 && oldArtwork_3 !== '') deleteFile(oldArtwork_3);
          if (oldPhoto && oldPhoto !== '') deleteFile(oldPhoto);

          res.redirect('/artist/' + req.body.artist_token);
        }
      });

    } else {
      res.redirect('/login');
    }


  });


  return router;

};