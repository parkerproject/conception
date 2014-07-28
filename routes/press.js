require('dotenv').load();

module.exports = function(router) {

    router.get('/press', function(req, res) {
        res.render('press', {
            data: 'parker'
        });
    });


    return router;
};