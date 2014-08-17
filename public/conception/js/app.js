var CONCEPTION = (function() {
  'use strict';

  function artistModal() {

    $(document).on('click', '.artist_profile', function(e) {
      e.preventDefault();
      var self = $(this),
        artistModal = $('#artistModal'),
        events_title, photoImage;


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
        //tickets_sold = self.data('tickets_sold'),
				//tickets_remaining = 15 - tickets_sold,
        status = (self.data('approved')) ? '<label>Approved <input type="checkbox" class="approve" name="approve" data-email="' + email + '" checked/></label>' : '<label>Approved <input type="checkbox" name="approve" class="approve" data-email="' + email + '"/></label>';

			
			
      var artworks = [];
      if (artwork_1 !== '') artworks.push('<a href="/artists_images/' + artwork_1 + '" target="_blank">Artwork 1</a>');
      if (artwork_2 !== '') artworks.push('<a href="/artists_images/' + artwork_2 + '" target="_blank">Artwork 2</a>');
      if (artwork_3 !== '') artworks.push('<a href="/artists_images/' + artwork_3 + '" target="_blank">Artwork 3</a>');

      if (events == '12420440873') events_title = 'Conception New City';
      if (events == '12423943349') events_title = 'Conception Philadelphia';
      if (events == '12423951373') events_title = 'Conception Liverpool';

      if (photo !== '') {
        photoImage = '/artists_images/' + photo;
      } else {
        photoImage = '/images/no-image.jpg';
      }


      artistModal.find('.event > a').html(url);
      artistModal.find('.age > strong').html(age);
      artistModal.find('.name').html(name);
      artistModal.find('.email > strong').html(email);
      artistModal.find('.genre > strong').html(genre);
      artistModal.find('.artwork > strong').html(artworks.join(''));
      artistModal.find('.url > strong').html(url);
      //artistModal.find('.remaining').html(tickets_remaining);
      //artistModal.find('.sold').html(tickets_sold);
      artistModal.find('.user-image > img').attr('src', photoImage);
      artistModal.find('.status').html(status);
      artistModal.find('.event').find('strong').html(events_title);


      if (self.data('tickets') !== 0) {

        artistModal.find('.empty_tickets').html('<label>Full tickets sold <input type="checkbox" class="empty_tickets" name="empty_tickets" data-email="' + email + '" />');
      } else {
				
        artistModal.find('.activate').html('<i class="fa fa-check-circle-o" style="color: green;"> Artist has sold all 15 tickets</i>');
      }

      artistModal.modal('show');

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