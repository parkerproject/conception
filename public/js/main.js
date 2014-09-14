$(function() {
  'use strict';
  $(document).foundation();
  CONCEPTION.init();
});

var CONCEPTION = {

  init: function() {
    this.enableSubmit();
    this.validate();
    this.validateUpload();
    this.validateAge();
    this.eventListHomepage();
    this.eventSinglePage();
    this.eventsPage();
    this.slider();
    this.scroll();
    this.search();
    this.ticketsTracker();
    this.generalTicketSale();
  },

  enableSubmit: function() {
    $('#terms_checkbox').on('change', function() {
      var self = $(this);
      if (self.is(':checked')) {
        $('.register-submit').removeAttr('disabled');
      } else {
        document.querySelector('.register-submit').disabled = 'disabled';
      }

    });
  },

  validate: function() {
    $('#artistForm').validate({
      rules: {
        birthMonth: {
          required: true
        },
        birthDay: {
          required: true
        },
        birthYear: {
          required: true
        },
        photo: {
          required: true,
          accept: "image/jpeg, image/pjpeg, image/png, image/gif"
        }
      }


    });

    $('#loginForm').validate();
  },

  validateUpload: function() {
    $('.file').change(function() {

      if (this.files.length > 0) {
        $(this).prev().addClass('icon-check');
      } else {
        $(this).prev().removeClass('icon-check');
      }

    });

  },

  validateAge: function() {
    $('#birth-year').on('change', function() {

      var today = new Date();
      var month = document.querySelector('.birth-month').value;
      var day = document.querySelector('.birth-day').value;
      var year = document.querySelector('.birth-year').value;

      month = (month !== '') ? month : '01';
      day = (day !== '') ? day : '01';
      year = (year !== '') ? year : new Date().getFullYear();


      var dob = new Date(month + '/' + day + '/' + year);
      var age = today.getFullYear() - dob.getFullYear();

      if (age < 21) {
        alert('You must be at least 21yrs to register');
      }
    });

  },

  eventsTemplate: function(data) {
    var day = moment(data.start_date).format("MMM-DD").split('-')[1];
    var month = moment(data.start_date).format("MMM-DD").split('-')[0];
    var start_time = moment(data.start_date).format("h:mmA");
    var end_time = moment(data.end_date).format("h:mmA");

    var images = ['philly_eventslist.png', 'liverpool_eventslist.png', 'new_york_eventslist.jpg'],
      img;

    if (data.venue.city === 'New York') {
      img = images[2];
    } else if (data.venue.city === 'Liverpool') {
      img = images[1];
    } else if (data.venue.city === 'Philadelphia') {
      img = images[0];
    } else {}

    var html = ['<li><img src="images/' + img + '" alt="" />',
      '<div class="row event-listing-info">',
      '<div class="large-4 columns event-listing-date-month">',
      ' <i class="month">' + month + '</i>',
      '<i class="day">' + day + '</i>',
      '</div>',
      '<div class="large-8 columns event-meta left">',
      ' <span class="letter-space event-type">artist</span>',
      ' <span class="letter-space event-title"><a href="/event/' + data.event_id + '">' + data.title + '</a></span>',
      '<span class="event-location">' + data.venue.address + '</span> ',
      ' //<span class="event-time">' + start_time + ' - ' + end_time + '</span>,',
      ' //<span class="event-venue">' + data.venue.name + '</span>',
      ' </div>',
      '</div>',
      '</li>'
    ].join('');

    return html;
  },

  upcomingEventTemplate: function(data) {
    var day = moment(data.start_date).format("MMM-DD").split('-')[1];
    var month = moment(data.start_date).format("MMM-DD").split('-')[0];
    var start_time = moment(data.start_date).format("h:mmA");
    var end_time = moment(data.end_date).format("h:mmA");

    var images = ['philly_event.jpg', 'liverpool_event.jpg', 'new_york_event.jpg'],
      img;

    if (data.venue.city === 'New York') {
      img = images[2];
    } else if (data.venue.city === 'Liverpool') {
      img = images[1];
    } else if (data.venue.city === 'Philadelphia') {
      img = images[0];
    } else {}

    var html = [
      '<div class="row event-row">',
      '<div class="large-4 columns event-image">',
      '<a class="th" href="#">',
      '<a href="event/' + data.event_id + '"><img src="/images/' + img + '" /></a>',
      '</a>',
      '<span class="event-date">',
      '<span>',
      '<i class="month">' + month + '</i><i class="day">' + day + '</i>',
      ' </span>',
      '<a href="http://www.eventbrite.com/event/' + data.event_id + '" class="buy-tickets">buy tickets<i class="icon-angle-double-right"></i></a>',
      '</span>',
      ' </div>',
      '<div class="large-8 columns event-meta">',
      ' <span class="letter-space event-type">artists</span>',
      '<span class="letter-space event-title"><a href="event/' + data.event_id + '">' + data.title + '</a></span>',
      '<span class="event-location">' + data.venue.address + '</span><span class="event-time">' + start_time + ' - ' + end_time + '</span>,<span class="event-venue">' + data.venue.name + '</span>',
      ' </div>',
      '</div>'
    ].join('');

    return html;

  },

  eventListHomepage: function() {
    if (window.hasOwnProperty('eventList') && !eventList.hasOwnProperty('error_type')) {
      var events = eventList,
        upcomingContent = [],
        pastContent = [],
        allContent = [];
      var upcomingEvents = events.filter(function(list) {
        return list.start_date > moment().format("YYYY-MM-DD HH:mm:ss");
      });

      var pastEvents = events.filter(function(list) {
        return list.start_date < moment().format("YYYY-MM-DD HH:mm:ss");
      });

      for (var i = 0; i < upcomingEvents.length; i++) {
        upcomingContent.push(this.upcomingEventTemplate(upcomingEvents[i]));
      };

      document.querySelector('.upcoming-event').innerHTML = upcomingContent.join('');
      $('.all-event').prepend(upcomingContent.join(''));
    }
  },


  eventSinglePage: function() {
    if (window.hasOwnProperty('fullEvent') && !fullEvent.hasOwnProperty('error_type')) {

      var day = moment(fullEvent.start_date).format("MMM-DD").split('-')[1];
      var month = moment(fullEvent.start_date).format("MMM-DD").split('-')[0];
      var start_time = moment(fullEvent.start_date).format("h:mmA");
      var end_time = moment(fullEvent.end_date).format("h:mmA");

      var images = ['philly_big.png', 'liverpool_big.png', 'new_york_big.png'],
        img;

      if (fullEvent.venue.city === 'New York') {
        img = images[2];
      } else if (fullEvent.venue.city === 'Liverpool') {
        img = images[1];
      } else if (fullEvent.venue.city === 'Philadelphia') {
        img = images[0];
      } else {}

      var address = (fullEvent.venue.address !== "") ? fullEvent.venue.address : 'TBD';

      var when_where = ['<span>' + address + ' // ' + start_time + ' - ' + end_time + '</span>',
        '<span class="event-location">' + fullEvent.venue.name + '</span>'
      ].join('');

      document.querySelector('.event-title').textContent = fullEvent.title;
      document.querySelector('.when-where').innerHTML = when_where;
      document.querySelector('.event-blurb').querySelector('p').innerHTML = fullEvent.description;
      $('.event-img').attr('src', '/images/' + img);
      document.querySelector('.month').innerHTML = month;
      document.querySelector('.day').innerHTML = day;

    }

  },

  eventsPage: function() {
    if (window.hasOwnProperty('eventsData') && !eventsData.hasOwnProperty('error_type')) {
      var events = eventsData;
      var contents = [];

      for (var i = 0; i < events.length; i++) {
        contents.push(this.eventsTemplate(events[i]));
      }

      document.querySelector('.event-listing').innerHTML = contents.join('');

    }
  },

  slider: function() {

    $('.home-slider').slick({

      dots: true,
      fade: true,
      autoplay: true,
      autoplaySpeed: 9000,
      onAfterChange: function(e) {
        var idx = e.currentSlide;
        document.querySelector('.caption').style.display = 'none';
        document.querySelector('.home-slider').querySelector('.index-' + idx).style.display = 'block';
      }

    });
  },

  scroll: function() {
    $(".scrollup").click(function() {
      $('html, body').animate({
        scrollTop: $(".top-bar-section").offset().top
      }, 2000);
    });
  },

  search: function() {

    if (typeof Bloodhound !== 'undefined') {
      var artists = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        prefetch: {

          url: '/artist_search',

          filter: function(list) {
            return $.map(list, function(artist) {
              return {
                name: artist
              };
            });
          }
        }
      });


      artists.initialize();


      $('#prefetch .typeahead').typeahead(null, {
        name: 'artists',
        displayKey: 'name',
        source: artists.ttAdapter()
      });
    }

  },

  ticketsTracker: function() {
    if (window.hasOwnProperty('user_event')) {

      var className = $('body').attr('id').toLowerCase();
      var quantity = 0;
      var event = (numberOfEvents === 1) ? user_event : user_event.split(',')[0];
      var salesRow = [];

      $.getJSON('/artist_orders', {
        event: event
      }, function(json) {
        var thisUser = _.filter(json.attendees, function(user) {
          return user.attendee.affiliate == className;
        });

        thisUser.forEach(function(e) {
          quantity += e.attendee.quantity;
          salesRow.push('<tr><td>' + e.attendee.first_name + ' ' + e.attendee.last_name + '</td><td>' + e.attendee.amount_paid + ' ' + e.attendee.currency + '</td><td>' + e.attendee.quantity + '</td><td>' + e.attendee.email + '</td></tr>');

        });



        var gangOfEight = ['shermaa@optonline.net', 'info@crespowulf.com', 'brianalessandro@gmail.com', 'artishurt@gmail.com', 'ebbowman@msn.com', 'manicprice@gmail.com', 'andrea@andreamckenna.com', 'info@artofkason.com', 'joey@kilrain.com', 'pbandjesse@gmail.com'];

        if (gangOfEight.indexOf(userEmail) != -1) {
          quantity += 2;
          salesRow.push('<tr><td>other sales</td><td>N/A</td><td>2</td><td>N/A</td></tr>');
          console.log('first');
        }


        var specialSales = ['markelfman@hotmail.com', 'brianalessandro@gmail.com', 'yaiel734@yahoo.co.uk'];

        if (specialSales.indexOf(userEmail) != -1 && userEmail == 'markelfman@hotmail.com') {
          quantity += 3;
          salesRow.push('<tr><td>other sales</td><td>N/A</td><td>3</td><td>N/A</td></tr>');
        }

        if (specialSales.indexOf(userEmail) != -1 && userEmail == 'brianalessandro@gmail.com') {
          quantity += 2;
          salesRow.push('<tr><td>other sales</td><td>N/A</td><td>2</td><td>N/A</td></tr>');
        }

        if (specialSales.indexOf(userEmail) != -1 && userEmail == 'yaiel734@yahoo.co.uk') {
          quantity += 1;
          salesRow.push('<tr><td>other sales</td><td>N/A</td><td>1</td><td>N/A</td></tr>');
        }


        document.querySelector('.sales-data').innerHTML = salesRow.join('');

        $('.ticket-sold').find('i').text(quantity);
        var ticketsLeft = 15 - quantity;

        if (ticketsLeft < 0) ticketsLeft = 0;

        $('.ticket-left').find('i').text(ticketsLeft);
        $('.reserve-link').find('i').text(ticketsLeft);

        var outstanding = $('.ticket-left').find('i').text();
        var amount;
        var name;

        if (user_event == 12420440873) {
          amount = 15 * outstanding; //new york
          name = "Conception NYC Tickets";

        } else if (user_event == 12423951373) {
          amount = 12.15 * outstanding; //liverpool
          name = "Conception Liverpool Tickets";

        } else if (user_event == 12423943349) {
          amount = 15 * outstanding; //philly
          name = "Conception Philadephia Tickets";

        } else {
          amount = 15 * outstanding; //new york
          name = "Conception NYC Tickets";
        }

        document.querySelector('.sales-name').innerHTML = name;

        if (ticketsLeft !== 0) {
          $('.paypal_holder').find('button.paypal-button').text('Buy remaining ' + outstanding + ' ticket(s)');
          $('.paypal_holder').find('input[name=amount]').val(amount);
          $('.paypal_holder').find('input[name=item_name]').val(name);
        }else{
					$('.paypal_holder').hide();
				}



      });

    }

  },

  generalTicketSale: function() {

    if ($('#generalTicketModal').length !== 0) {

      document.querySelector('#generalTicketModal').querySelector('.event-title').textContent = fullEvent.title;

      $('.next_step').on('click', function(e) {
        e.preventDefault();

        var artist = $('.ticket_type').val();
        window.location.href = 'http://www.eventbrite.com/event/' + conception_event + '?ref=' + artist;

      });
    }

  },
	
	featuredHostController: function(){
		
	}

};