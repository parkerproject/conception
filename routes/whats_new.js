require('dotenv').load();
var _request = require('request');
var url = 'https://www.googleapis.com/blogger/v3/blogs/7805519445622295465/posts?key=AIzaSyCLea6TYussNWrxZ7TjTpPWhNcgigrFurc';


module.exports = function(router) {

  router.get('/what-new', function(req, res) {


    _request(url, function(error, response, body) {
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