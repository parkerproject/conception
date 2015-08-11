require('dotenv').load();
var rp = require('request-promise');
var api_key = 'AIzaSyCLea6TYussNWrxZ7TjTpPWhNcgigrFurc';
var url = 'https://www.googleapis.com/blogger/v3/blogs/7805519445622295465/posts?key=' + api_key;

module.exports = function(router) {

  router.get('/what-new', function(req, res) {

    rp(url)
      .then(function(response) {
			
			var blogs = JSON.parse(response);

        res.render('whats_new', {
          blogs: blogs.items
        });


      }).catch (console.error);

  });


  return router;
};