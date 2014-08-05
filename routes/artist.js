function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
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
      message: req.flash('error')
    });
  });


//   router.post('/login', passport.authenticate('local', {
//     failureRedirect: '/login',
//     failureFlash: true
//   }), function(req, res) {

//     db.artists.findOne({
//       email: req.body.username,
//       approved: true
//     }, function(err, user) {
//       if (err || !user) console.log("No user found");
//       else {
//         res.render('edit_profile', {
//           title: '',
//           data: user
//         });
//       }
//     });

//   });



  router.post('/login', function(req, res) {

    db.artists.findOne({
      email: req.body.username,
      password: req.body.password,
      approved: true
    }, function(err, user) {
      if (err || !user) res.redirect('/login');
      req.session.authenticated = true;
      res.render('edit_profile', {
        title: '',
        data: user
      });
			
    });

  });



  // handles editing of artist profile =======================
  router.post('/artist_update', ensureAuthenticated, function(req, res) {

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
            instagram: req.body.artist_instagram,
            url: req.body.artist_url,
						music_url: req.body.artist_music
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