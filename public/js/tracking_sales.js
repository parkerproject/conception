/**
 * Created with conception.
 * User: parkerproject
 * Date: 2014-07-31
 * Time: 04:18 AM
 * To change this template use Tools | Templates.
 */



(function($) {

  var sendTo = "http://www.eventbrite.com/event/4653432542?ref=ebtn";

  $('.artist-profile').on('click', '.artist-submit', function(e) {
    e.preventDefault();
    var user = $(this).attr('data-artist');
		$.cookie('conception_artist', user, {path: '/'});
    var event_id = $.cookie('conception_event');
    window.location.href = 'http://www.eventbrite.com/event/' + event_id + '?ref=' + user;
  });
})(jQuery);