#!/bin/env node

require('dotenv').load();
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var cloudinary = require('cloudinary');
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun(process.env.MAIL_GUN_API);

// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}


var databaseUrl = connection_string;
var collections = ['artists'];
var db = require("mongojs").connect(databaseUrl, collections);


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// function uploadFile(file, name, callback) {
//   cloudinary.uploader.upload(file, function(json) {
//     callback(json);
//   }, {
//     public_id: name
//   });
// }




function sendEmail(toEmail, name, link) {

    var emailHtml = 'From: noreply@conceptionevents.com' +
        '\nTo: ' + toEmail +
        '\nContent-Type: text/html; charset=utf-8' +
        '\nSubject: Conception Events: Activate your account' +
        '\n\nHi ' + name +
        '\nWelcome to Conception Events!' +
        '\nHey,thanks for submitting your artwork! Please verify your email by clicking this ' + link +
        '\n\nHave a great day' +
        '\nConception Team';


    mg.sendRaw('noreply@conceptionevents.com', toEmail, emailHtml, function(err) {
        if (err) console.log(err);
        if (!err) console.log('email sent');
    });

}


function passwordEmail(toEmail, name, password) {

    var emailHtml = 'From: noreply@conceptionevents.com' +
        '\nTo: ' + toEmail +
        '\nContent-Type: text/html; charset=utf-8' +
        '\nSubject: Conception Events: Activate your account' +
        '\n\nHi ' + name +
        '\nWelcome to Conception Events!' +
        '\nYour password is ' + password +
        '\n\nHave a great day' +
        '\nConception Team';


    mg.sendRaw('noreply@conceptionevents.com', toEmail, emailHtml, function(err) {
        if (err) console.log(err);
        if (!err) console.log('email sent');
    });

}


function sendAdminEmail() {

    var body = 'From: noreply@conceptionevents.com' +
        '\nTo: ' + process.env.CONCEPTION_ADMIN_EMAIL +
        '\nContent-Type: text/html; charset=utf-8' +
        '\nSubject: Conception Events: New Artist' +
        '\nHey buddy!, A new artist has just joined Conception Events.' +
        '<a href="http://conception-mypinly.rhcloud.com/conception">Login to approve</a>' +
        '\n\nHave a great day<br />' +
        '\nConception Robot';

    mg.sendRaw('noreply@conceptionevents.com', process.env.CONCEPTION_ADMIN_EMAIL, body, function(err) {
        if (err) console.log(err);
        if (!err) console.log('email sent');
    });



}


module.exports = function(router) {
    router.get('/register', function(req, res) {
        res.render('register', {
            data: 'parker'
        });
    });


    router.get('/thank_you', function(req, res) {
        var passedVariable = req.query.data;
        res.render('thank_you', {
            data: passedVariable
        });
    });



    router.post('/process_register', function(req, res) {

        var password = randtoken.generate(5),
            artwork_1_name = (req.files.hasOwnProperty('artwork_1')) ? req.files.artwork_1.name : '',
            artwork_2_name = (req.files.hasOwnProperty('artwork_2')) ? req.files.artwork_2.name : '',
            artwork_3_name = (req.files.hasOwnProperty('artwork_3')) ? req.files.artwork_3.name : '',
            photo = (req.files.hasOwnProperty('photo')) ? req.files.photo.name : '';


        var userInfo = {
            full_name: req.body.name,
            password: '',
            email: req.body.email,
            user_token: randtoken.generate(10),
            emailVerified: false,
            approved: false,
            dateBirth: {
                month: req.body.birthMonth,
                day: req.body.birthDay,
                year: req.body.birthYear
            },
            genre: req.body.genre,
            url: req.body.url,
            artwork_1: artwork_1_name,
            artwork_2: artwork_2_name,
            artwork_3: artwork_3_name,
            photo: photo,
            story: '',
            facebook_url: '',
            twitter_url: '',
            instagram: '',
            googleplus: ''
        };



        db.artists.findOne({
            email: req.body.email
        }, function(err, result) {

            if (err) console.log('first error ' + err);
            if (result == null) {

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {

                        userInfo.password = hash;

                        setTimeout(function() {
                            db.artists.save(userInfo, function(err, result) {
                                if (err) console.log('second error ' + err);
                                if (result) console.log('Added!');

                                var link = 'http://conception-mypinly.rhcloud.com/verifyemail/user/' + userInfo.user_token;

                                sendEmail(userInfo.email, userInfo.full_name, link);
                                sendAdminEmail();

                            });
                            var string = encodeURIComponent('Thank you for submitting. We would get back to you soon.');
                            res.redirect('/thank_you?data=' + string);
                        }, 0);

                    });

                });
            } else {
                res.send('User already exist <a href="/">Back to Conception</a>');
            }
        });
    });


    router.get('/verifyemail/user/:token', function(req, res) {
        var token = req.params.token;
        db.artists.findAndModify({
            query: {
                user_token: token
            },
            update: {
                $set: {
                    emailVerified: true
                }
            },
            new: true
        }, {

        }, function(err, doc, lastErrObj) {
            if (err) {
                console.log(err);
            } else {
                console.log(doc);
                // passwordEmail()
            }
        });
        var string = encodeURIComponent('You account is now verified. Expect an email shortly');
        res.redirect('/thank_you?data=' + string);
    });

    return router;
};