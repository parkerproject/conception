$(function() {
  'use strict';
  $(document).foundation();
  CONCEPTION.init();
});

var CONCEPTION = {

  init: function() {
    this.validate();
    this.validateUpload();
    this.validateAge();
    this.eventListHomepage();
    this.eventSinglePage();
    this.eventsPage();
    this.slider();
    this.scroll();
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
      '<a href="event/' + data.event_id + '" class="buy-tickets">buy tickets<i class="icon-angle-double-right"></i></a>',
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

  artistTemplate: function(artist) {
    var html = ['<div class="large-4 columns featured_artists">',
      '<a class="featured_artists_img" href="/artist/' + artist.user_token + '"><img src="/artists_images/' + artist.photo + '" alt="' + artist.full_name + '" /></a>',
      '<span class = "name"> <a href = "/artist/' + artist.user_token + '"> ' + artist.full_name + ' <i class = "icon-angle-double-right"></i></a></span>',
      '<span class="title">' + artist.genre + '</span ></div>'
    ].join('');
    return html;

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

    }
		
		
		if (window.hasOwnProperty('artists')) {
			
			var listOfArtists = [];
			var self = this;
			
			artists.map(function(artist){
				listOfArtists.push(self.artistTemplate(artist));
			});
			
			document.querySelector('.artists-holder').innerHTML = listOfArtists.join('');
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
  }


};