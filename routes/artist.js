var randtoken = require('rand-token');
var email = require('../email');

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
      message: req.params.error
    });
  });




  router.post('/login', function(req, res) {

    db.artists.findOne({
      email: req.body.username,
      password: req.body.password
    }, function(err, user) {
      if (err || !user) res.redirect('/login?error=unknown user');
      req.session.authenticated = true;
      res.render('edit_profile', {
        title: '',
        data: user
      });

    });

  });


  router.get('/reset_password', function(req, res) {
    res.render('reset_password', {
      title: 'reset password'
    });
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