require('dotenv').load();


module.exports = function(router) {

  router.get('/what-new', function(req, res) {

    var request = require('request');
    var api_key = 'AIzaSyCLea6TYussNWrxZ7TjTpPWhNcgigrFurc';
    var url = 'https://www.googleapis.com/blogger/v3/blogs/7805519445622295465/posts?key=' + api_key;
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var blogs = JSON.parse(body);

        res.render('whats_new', {
          blogs: blogs.items
        });
      }
    });


  });


  return router;
};