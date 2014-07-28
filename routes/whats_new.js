require('dotenv').load();

module.exports = function(router) {

    router.get('/what-new', function(req, res) {
        res.render('whats_new', {
            data: 'parker'
        });
    });


    return router;
};