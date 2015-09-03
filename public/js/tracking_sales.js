/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-07-31
 * Time: 04:18 AM
 * To change this template use Tools | Templates.
 */



(function($) {

    $('.artist-profile').on('click', '.artist-submit', function(e) {
        e.preventDefault();

        var userEvent = $(this).attr('data-events');
        var user = $(this).attr('data-artist');
        var event_id = $.cookie('conception_event');
        $.cookie('conception_artist', user, {
            path: '/'
        });
        $.cookie('conception_general_sale', 'no', {
            path: '/'
        });



        if (event_id == null) {
            $('#request_event').foundation('reveal', 'open');

            $('#request_event select').on('change', function() {

                var sEvent = $(this).val();
                $.cookie('conception_event', sEvent, {
                    path: '/'
                });
							console.log(sEvent);
                window.location.href = 'http://www.eventbrite.com/event/' + sEvent + '?ref=' + user;

            });

        } else if (event_id != null && event_id !== userEvent) {

            $('#request_event').foundation('reveal', 'open');

            $('#request_event select').on('change', function() {

                var sEvent = $(this).val();
                $.cookie('conception_event', sEvent, {
                    path: '/'
                });
                window.location.href = 'http://www.eventbrite.com/event/' + sEvent + '?ref=' + user;

            });

        } else {
            window.location.href = 'http://www.eventbrite.com/event/' + event_id + '?ref=' + user;
        }




    });

    $('.reserve-link').click(function() {
        var user = $('#reserve-spot').attr('data-artist');
        $.cookie('conception_reserve_artist', user, {
            path: '/'
        });

    });

})(jQuery);