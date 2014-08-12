var CONCEPTION = (function() {
  'use strict';

  function rowTpl(model) {
    var colorLabel, html, ticketSold;
    if (model.hasOwnProperty('tickets')) {
      if (model.tickets[0].ticket.quantity_sold === 0) {
        colorLabel = 'bg-red';
      } else {
        colorLabel = 'bg-green';
      }
      ticketSold = model.tickets[0].ticket.quantity_sold;
    } else {
      colorLabel = 'bg-yellow';
      ticketSold = 'Create tickets';
    }

    // var colorLabel = (model.tickets[0].ticket.quantity_sold)
    html = ['<tr>',
      '<td>' + model.id + '</td>',
      '<td>' + model.title + '</td>',
      '<td>' + model.start_date + '</td>',
      '<td>' + model.end_date + '</td>',
      '<td>' + model.status + '</td>',
      '<td width="10%"><span class="badge ' + colorLabel + '">' + ticketSold + '</span></td>',
      '</tr>'
    ].join("");

    return html;
  }

  function template(row) {
    var html = ['<div class="box">',
      '<div class="box-body">',
      '<table class="table table-bordered table table-hover dataTable">',
      '<tbody><tr>',
      '<th style="width: 10px">Event ID</th>',
      '<th>Name</th>',
      '<th>Start date</th>',
      '<th>End date</th>',
      '<th>Status</th>',
      '<th>Tickets sold</th>',
      '</tr>' + row + '</tbody></table>',
      '</div>',
      '</div>'
    ].join("");
    return html;
  }

  function artistTplHeader(row) {
    var html = ['<div class="box">',
      '<div class="box-body">',
      '<table class="table table-bordered table table-hover dataTable">',
      '<tbody><tr>',
      '<th style="width: 10px">Artist</th>',
      '<th>Email</th>',
      '<th>Age</th>',
      '<th>Event</th>',
      '<th style="width: 25%">Artwork</th>',
      '<th>Photo</th>',
      '<th>Url</th>',
      '<th>Approved</th>',
      '</tr>' + row + '</tbody></table>',
      '</div>',
      '</div>'
    ].join("");
    return html;
  }

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
        tickets_remaining = self.data('tickets'),
        tickets_sold = 15 - tickets_remaining,
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
      artistModal.find('.remaining').html(tickets_remaining);
      artistModal.find('.sold').html(tickets_sold);
      artistModal.find('.user-image > img').attr('src', photoImage);
      artistModal.find('.status').html(status);
      artistModal.find('.event').find('strong').html(events_title);

      if (self.data('reserved') === 'no') {
        artistModal.find('.activate').html('<label>Activate <input type="checkbox" class="activate" name="activate" data-email="' + email + '" />');
      }

      console.log(events_title);

      artistModal.modal('show');

    });


  }




  //   function routes() {

  //     page('/conception/:name', function(ctx) {

  //       var name = ctx.params.name;

  //       if (name == 'events') {
  //         $.getJSON('/conception/' + name, function(data) {
  //           var events = data.events,
  //             html = [],
  //             rows;
  //           for (var i = 0; i < events.length; i++) {
  //             html.push(rowTpl(events[i].event));
  //           }

  //           rows = template(html.join(""));
  //           document.querySelector('.event_json').innerHTML = rows;
  //           document.querySelector('.content-header').querySelector('h1').innerHTML = 'Events';
  //         });
  //       }

  //       if (name == 'artists') {
  //         $.getJSON('/conception/' + name, function(data) {

  //           var rows = [],
  //             content;

  //           data.map(function(artist) {
  //             rows.push(artistTemplate(artist));
  //           });

  //           content = artistTplHeader(rows.join(""));
  //           document.querySelector('.event_json').innerHTML = content;
  //           document.querySelector('.content-header').querySelector('h1').innerHTML = 'Artists';
  //         });

  //       }


  //     });


  //     page('/conception', function() {
  //       var dashboardTpl = Templates.dashboard();
  //       document.querySelector('.event_json').innerHTML = dashboardTpl;
  //       document.querySelector('.content-header')
  //         .querySelector('h1')
  //         .innerHTML = 'Dashboard';

  //     });

  //     page();
  //   }


  function approveUsers() {
    $(document).on('click', '.approve', function() {

      console.log('yes me now');

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


  function activateUsers() {
    $(document).on('click', '.activate', function() {

      console.log('user activated');

      var email = $(this).data('email');

      $.post('/activate_artist', {
        email: email,
        reserved: 'yes'
      }, function(data) {
        console.log(data);
      });
    });

  }


  function conceptionInit() {
    artistModal();
    approveUsers();
		activateUsers();
  }




  return {
    conceptionInit: conceptionInit
  };

}());

$(function() {
  CONCEPTION.conceptionInit();
});