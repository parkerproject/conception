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
        this.search();
        this.ticketsTracker();
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
        var className = $('body').attr('id').toLowerCase();

        $('.ticket_tracker').on('change', function() {

            var quantity = 0;
            $('.ticket-sold').find('i').text(quantity);
            $('.ticket-left').find('i').text(0);
            $('.reserve-link').find('i').text(0);

            var user_event = $(this).val();

            $.getJSON('/artist_orders', {
                event: user_event
            }, function(json) {
                var thisUser = _.filter(json.attendees, function(user) {
                    return user.attendee.affiliate == className;
                });

                thisUser.forEach(function(e) {
                    quantity += e.attendee.quantity;
                    $('.ticket-sold').find('i').text(quantity);
                    var ticketsLeft = 15 - quantity;
                    $('.ticket-left').find('i').text(ticketsLeft);
                    $('.reserve-link').find('i').text(ticketsLeft);

                });

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

                $('.paypal_holder').find('button.paypal-button').text('Buy remaining ' + outstanding + ' ticket(s)');
                $('.paypal_holder').find('input[name=amount]').val(amount);
                $('.paypal_holder').find('input[name=item_name]').val(name);

                $('#tickets_tracker').foundation('reveal', 'open');


            });

        });

    }



};