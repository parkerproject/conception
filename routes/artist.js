module.exports = function(router, passport, db) {

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
      message: req.flash('error')
    });
  });


  router.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true
  }), function(req, res) {

    db.artists.findOne({
      email: req.body.username
    }, function(err, user) {
      if (err || !user) console.log("No user found");
      else {
        res.render('edit_profile', {
          title: '',
          data: user
        });
      }
    });

  });

// handles editing of artist profile =======================
  router.post('/artist_update', function(req, res) {

    if (req.url == '/artist_update') {
      db.artists.findAndModify({

        query: {
          email: req.body.artist_email_hidden
        },
        update: {
          $set: {
            story: req.body.my_story,
            facebook_url: req.body.artist_facebook_url,
            twitter_url: req.body.artist_twitter_url,
            url: req.body.artist_url
          }
        }

      }, function(err, user) {
        if (err || !user) console.log("No user found");
        else {
          res.redirect('/artist/' + req.body.artist_token);
        }
      });

    } else {
      res.redirect('/login');
    }


  });


  return router;

};