$(function() {
  'use strict';
  //$(document).foundation();
  CONCEPTION.init();
});

var CONCEPTION = {

  init: function() {
    this.enableSubmit();
    this.validate();
    this.validateUpload();
    this.validateAge();
   // this.slider();
    this.scroll();
    //this.search();
    this.ticketsTracker();
    this.generalTicketSale();
    this.attendingEvents();
  },




  attendingEvents: function() {

    $(document).on('change', '.checkboxSwitch', function() {

      var event_id = $(this).val();
      var user = $('input[name=artist_token]').val();

      var checked = $(this).is(':checked');
      if (checked) {
        $.post("/artist_attendingevent", {
          user: user,
          event_id: event_id
        }, function(result) {
          console.log('you are now attending');
        });

      } else {
        $.post("/artist_not_attendingevent", {
          user: user,
          event_id: event_id
        }, function(result) {
          console.log('you are not attending');
        });

      }

    });

  },

  eventsMap: function(eventNum) {

    var eventsMap = {
      '17622204488': 'Conception NYC Tickets'
    };

    if (eventsMap.hasOwnProperty(eventNum)) {
      return eventsMap[eventNum];
    } else {
      return;
    }

  },


  enableSubmit: function() {
    $('#terms_checkbox').on('change', function() {
      var self = $(this);
			var moreThan21 = $('input[name=age]:checked').val();
			console.log(moreThan21);
      if (self.is(':checked') && moreThan21 == 'yes') {
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
          required: true
         // accept: "image/jpeg, image/jpg, image/png, image/gif"
        },

        captcha: {
          required: true,
          accept: 5
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
    $('.age input').on('change', function() {

      var moreThan21 = $('input[name=age]:checked').val();
			var terms = $('#terms_checkbox');

      if (moreThan21 === 'no') {
        alert('You must be at least 21yrs to register');
				document.querySelector('.register-submit').disabled = 'disabled';
      }
			
			if(moreThan21 === 'yes' && terms.is(':checked') ){
				 $('.register-submit').removeAttr('disabled');
			}
    });

  },


  slider: function() {

    $('.home-slider').slick({

      dots: true,
      fade: true,
      autoplay: true,
      autoplaySpeed: 9000,
      onAfterChange: function(e) {
        //var idx = e.currentSlide;
        //document.querySelector('.caption').style.display = 'none';
        //document.querySelector('.home-slider').querySelector('.index-' + idx).style.display = 'block';
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
						console.log(list);
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

  payPalBtnController: function(ticketsLeft, name, currency) {

    var amount = (currency == 'GBP') ? 12.50 : 15.00;

    if (ticketsLeft > 0) {
      $('.paypal_holder').find('button.paypal-button').text('Buy remaining ' + ticketsLeft + ' ticket(s)');
      $('.paypal_holder').find('input[name=amount]').val(amount);
      $('.paypal_holder').find('input[name=item_name]').val(name);

      //remove first to avoid duplicates
      $('.paypal_holder').find('input[name="currency_code"]').remove();

      $('.paypal_holder').find('form').append('<input name="currency_code" type="hidden" value="' + currency + '"/>');
    } else {
      $('.paypal_holder').find('button.paypal-button').text('Buy extra ticket(s)');
      $('.paypal_holder').find('input[name=amount]').val(amount);
      $('.paypal_holder').find('input[name=item_name]').val(name);

      //remove to prevent duplicates
      $('.extra_ticket').remove();
      $('.paypal_holder').find('input[name="currency_code"]').remove();

      $('<input name=quantity value="" placeholder="enter any number" class="extra_ticket" />').insertBefore('button.paypal-button');
      $('.paypal_holder').find('form').append('<input name="currency_code" type="hidden" value="' + currency + '"/>');
    }

  },

  ticketsTracker: function() {
    if (window.hasOwnProperty('user_event')) {

      var className = $('body').attr('id');
      var quantity = 0;
      var salesRow = [];


      CONCEPTION.getLiveEvents(function(eventsLive) {

        //var eventsArray = eventsLive.events;


        eventsLive.forEach(function(event) {

          var eventId = event.event.id;

          CONCEPTION.getAttendees(eventId, function(event) {


            var thisUser = _.filter(event.attendees, function(user) {
              return user.attendee.affiliate == className;
            });


            thisUser.forEach(function(e) {
              //  $('a[data-reveal-id="tickets_tracker"]').show();
              quantity += e.attendee.quantity;
              console.log(quantity, e.attendee.quantity);

              var remaining = 15 - quantity;
              var remainTickets = (remaining >= 0) ? remaining : 0;
              var eventName = CONCEPTION.eventsMap(e.attendee.event_id);
              $('.sales-data').append('<tr><td>' + e.attendee.first_name + ' ' + e.attendee.last_name + '</td><td>' + e.attendee.amount_paid + ' ' + e.attendee.currency + '</td><td>' + e.attendee.quantity + '</td><td>' + e.attendee.email + '</td><td>' + eventName + '</td></tr>');
              $('.ticket-sold').find('i').text(quantity);
              $('.ticket-left').find('i').text(remainTickets);
             // CONCEPTION.payPalBtnController(remainTickets, eventName, e.attendee.currency);
            });

          });

        });

      });

    }

  },

  getLiveEvents: function(callback) {
    $.getJSON('/oneventbrites', {}, function(json) {
      callback(json);
    });
  },

  getAttendees: function(event, callback) {
    $.getJSON('/artist_orders', {
      event: event
    }, function(json) {
      callback(json);
    });
  },


  generalTicketSale: function() {

    if ($('#generalTicketModal').length !== 0) {

      document.querySelector('#generalTicketModal').querySelector('.event-title').textContent = fullEvent.title;

      $('.next_step').on('click', function(e) {
        e.preventDefault();

        var url= $('.ticket_type').val();
        window.location.href = url;


      });
    }

  },

  featuredHostController: function() {

  }

};