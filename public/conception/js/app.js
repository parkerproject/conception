var CONCEPTION = (function() {
  'use strict';

  function artistModal() {

    $(document).on('click', '.artist_profile', function(e) {
      e.preventDefault();

      var self = $(this),
        artistModal = $('#artistModal'),
        events_title, photoImage;

      artistModal.find('.activate').html('');
      artistModal.find('.remaining').html('');
      artistModal.find('.sold').html('');


      var name = self.data('full_name'),
        age = self.data('age'),
        genre = self.data('genre'),
        artwork_1 = self.data('artwork_1'),
        artwork_2 = self.data('artwork_2'),
        artwork_3 = self.data('artwork_3'),
        photo = self.data('photo'),
        url = self.data('url'),
        email = self.data('email'),
        events = self.data('events'),
        user_token = self.data('user_token'),
        password = self.data('user_password'),
        status = (self.data('approved')) ? '<label>Approved <input type="checkbox" class="approve" name="approve" data-email="' + email + '" checked/></label>' : '<label>Approved <input type="checkbox" name="approve" class="approve" data-email="' + email + '"/></label>';



      var artworks = [];
      if (artwork_1 !== '') artworks.push('<a href="/artists_images/' + artwork_1 + '" target="_blank">Artwork 1</a>');
      if (artwork_2 !== '') artworks.push('<a href="/artists_images/' + artwork_2 + '" target="_blank">Artwork 2</a>');
      if (artwork_3 !== '') artworks.push('<a href="/artists_images/' + artwork_3 + '" target="_blank">Artwork 3</a>');

      if (events == '12420440873') events_title = 'Conception New York City';
      if (events == '12423943349') events_title = 'Conception Philadelphia';
      if (events == '12423951373') events_title = 'Conception Liverpool';

      if (photo !== '') {
        photoImage = 'http://www.conceptionevents.com/artists_images/' + photo;
      } else {
        photoImage = '/images/no-image.jpg';
      }

      console.log(typeof events);

      var className = user_token.toLowerCase();
      var quantity = 0;
      var event = (typeof events === 'number') ? events : events.split(',')[0];
      var salesRow = [];

      $.getJSON('/artist_orders', {
        event: events
      }, function(json) {


        var thisUser = _.filter(json.attendees, function(user) {
          return user.attendee.affiliate == className;
        });

        thisUser.forEach(function(e) {
          quantity += e.attendee.quantity;

        });


        var gangOfEight = ['shermaa@optonline.net', 'info@crespowulf.com', 'brianalessandro@gmail.com', 'artishurt@gmail.com', 'ebbowman@msn.com', 'manicprice@gmail.com', 'andrea@andreamckenna.com', 'info@artofkason.com', 'joey@kilrain.com', 'pbandjesse@gmail.com'];

        if (gangOfEight.indexOf(email) != -1) {
          quantity += 2;

        }

        var specialSales = ['markelfman@hotmail.com', 'brianalessandro@gmail.com', 'yaiel734@yahoo.co.uk'];

        if (specialSales.indexOf(email) != -1 && email == 'markelfman@hotmail.com') {
          quantity += 3;
        }

        if (specialSales.indexOf(email) != -1 && email == 'brianalessandro@gmail.com') {
          quantity += 2;
        }

        if (specialSales.indexOf(email) != -1 && email == 'yaiel734@yahoo.co.uk') {
          quantity += 1;
        }

        if (email == 'ebbowman@msn.com') {
          quantity += 8;
        }

        if (email == 'johnkolbek@gmail.com') {
          quantity += 1;
        }

        if (email == 'mikewolf.nyc@gmail.com') {
          quantity -= 9;
        }

        if (email == 'aaronasis@gmail.com') {
          quantity += 1;
        }

        if (email == 'stephencrete@live.co.uk' || email == 'debbie.diamond@ymail.com') {
          quantity = 15;
        }


        var ticketsLeft = 15 - quantity;

        if (ticketsLeft < 0) ticketsLeft = 0;

        artistModal.find('.event > a').html(url);
        artistModal.find('.age > strong').html(age);
        artistModal.find('.name').html(name);
        artistModal.find('.email > strong').html(email);
        artistModal.find('.genre > strong').html(genre);
        artistModal.find('.artwork > strong').html(artworks.join(''));
        artistModal.find('.url > strong').html(url);
        artistModal.find('.remaining').html(ticketsLeft);
        artistModal.find('.sold').html(quantity);
        artistModal.find('.user-image > img').attr('src', photoImage);
        artistModal.find('.status').html(status);
        artistModal.find('.event').find('strong').html(events_title);
        artistModal.find('.password').html(password);

        artistModal.modal('show');

        //         $.getJSON('/get_artist_ticket', {
        //           user_token: user_token
        //         }, function(data) {

        // 					console.log('testing'+data);

        //           if (ticketsLeft > 0 && data > 0) {
        // 						console.log(ticketsLeft, data);
        //             artistModal.find('.empty_tickets').html('<label>Full tickets sold <input type="checkbox" class="empty_tickets" name="empty_tickets" data-email="' + email + '" />');
        //            artistModal.find('.activate').html('');
        // 					}


        //           artistModal.modal('show');



        //         });


      });



    });


  }



  function approveUsers() {
    $(document).on('click', '.approve', function() {

      var email = $(this).data('email');
      var approved = ($(this).is(":checked")) ? true : false;

      $.post('/approve_artist', {
        email: email,
        approved: approved
      }, function(data) {
        console.log(data);
      });

    });

  }



  function fullTickets() {
    $(document).on('click', '.empty_tickets', function() {

      var email = $(this).data('email');

      $.post('/full_tickets', {
        email: email
      }, function(data) {
        console.log(data);
      });

    });

  }

  function instantSearch() {
    $('input#search-artist').quicksearch('table tbody tr');
  }




  function conceptionInit() {
    artistModal();
    approveUsers();
    fullTickets();
    instantSearch();
  }




  return {
    conceptionInit: conceptionInit
  };

}());

$(function() {
  CONCEPTION.conceptionInit();
});