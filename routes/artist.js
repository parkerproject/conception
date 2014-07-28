require('dotenv').load();

module.exports = function(router) {

    router.get('/artist', function(req, res) {
        res.render('artist', {
            data: 'parker'
        });
    });


    return router;

};