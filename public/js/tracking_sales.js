/**
* Created with conception.
* User: parkerproject
* Date: 2014-07-31
* Time: 04:18 AM
* To change this template use Tools | Templates.
*/



(function($){
	var conception_event = location.pathname.split('/')[2];
	$.cookie('conception_event', conception_event);
})(jQuery);