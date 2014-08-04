require('dotenv').load();

var db = require('../config/database');

function getArtist(email, fn) {
  db.artists.findOne({
    email: email,
    emailVerified: true,
    approved: true
  }, function(err, user) {
    if (err || !user) console.log("No user found");
    else fn(user);
  });
}

function artistTemplate(artist) {
  var html = ['<div class="large-4 columns featured_artists">',
  '<a class="featured_artists_img" href="/artist/' + artist.user_token + '"><img src="/artists_images/' + artist.photo + '" alt="' + artist.full_name + '" /></a>',
  '<span class = "name"> <a href = "/artist/'+artist.user_token+'"> '+artist.full_name+' <i class = "icon-angle-double-right"></i></a></span>',
  '<span class="title">'+artist.genre+'</span ></div>'].join('');
	return html;

}

module.exports = function(router) {


  router.get('/event/:id', function(req, res) {
    var id = parseInt(req.params.id);
    db.events.findOne({
      "event_id": id
    }, function(err, event) {
      if (err || !event) {
        console.log(err);
      } else {

        var artists = [];

        event.artists.map(function(artist) {
          getArtist(artist, function(details) {
						artists.push({
							user_token: details.user_token,
							photo: details.photo,
							full_name: details.full_name,
							genre: details.genre
						});
          });
        });
        setTimeout(function() {
          res.render('event', {
            title: 'conception events',
            data: JSON.stringify(event),
            artists: JSON.stringify(artists),
						event_id: id
          });
        }, 0);

      }
    });

  });


  return router;
};