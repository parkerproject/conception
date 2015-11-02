require('dotenv').load();
var request = require('superagent');
var url = 'https://www.googleapis.com/blogger/v3/blogs/7805519445622295465/posts?key=AIzaSyCLea6TYussNWrxZ7TjTpPWhNcgigrFurc';

module.exports = function(router) {

  router.get('/what-new', function(req, res) {

    request
      .get(url)
      .end(function(err, response) {

        res.render('new/whats_new', {
          blogs: response.body.items
        });
      });

  });


  return router;
};