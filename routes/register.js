#!/bin/env node

require('dotenv').load();
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var cloudinary = require('cloudinary');
var nodemailer = require('nodemailer');
var fs = require('fs');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'mailgun',
    auth: {
        user: 'postmaster@mg.conceptionevents.com',
        pass: process.env.MAIL_GUN_PASS
    }
});


// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/conception';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
}


var databaseUrl = connection_string;
var collections = ['artists', 'events'];
var db = require("mongojs").connect(databaseUrl, collections);


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


function uploadFile(token, file, name, version) {
    cloudinary.uploader.upload(file, function(json) {

        var set;

        if (version === 1) set = {
            artwork_1: json.url
        };
        if (version === 2) set = {
            artwork_2: json.url
        };
        if (version === 3) set = {
            artwork_3: json.url
        };
        if (version === 4) set = {
            photo: json.url
        };

        db.artists.findAndModify({
            query: {
                user_token: token
            },
            update: {
                $set: set
            }
        }, function(err, doc, lastErrObj) {
            if (err) {
                console.log(err);
            } else {
                console.log('image path updated');
                fs.unlink(file, function(err) {
                    if (err) console.log(err);
                    console.log('successfully deleted: ' + file);
                });
            }
        });


    }, {
        public_id: name
    });
}


function sendEmail(toEmail, name, link) {

    var emailHtml = 'Hi <b>' + name + '</b><br /><br />' +
        '<i>Welcome to Conception Events</i>!<br />' +
        '<br />Hey,thanks for submitting your artwork! Please verify your email by clicking this ' + link +
        '<br /><br />Have a great day' +
        '<br />Conception Team';

    transporter.sendMail({
        from: 'noreply@conceptionevents.com',
        to: toEmail,
        subject: 'Conception Events: Activate your account',
        html: emailHtml
    }, function(err, status) {
        if (err) console.log(err);
        if (status) console.log('email sent');
    });

}


function sendPasswordEmail(toEmail, name, password) {

    var emailHtml = 'Hi <b>' + name + '</b>' +
        '<br /><br /><em>Your login details below</em>' +
        '<br />Your username is ' + toEmail +
        '<br />Your password is ' + password +
        '<br /><br />Have a great day' +
        '<br />Conception Team';

    transporter.sendMail({
        from: 'noreply@conceptionevents.com',
        to: toEmail,
        subject: 'Conception Events: Login details',
        html: emailHtml
    }, function(err, status) {
        if (err) console.log(err);
        if (status) console.log('login email sent');
    });

}


function sendAdminEmail() {

    var body = 'Hey buddy!<br /><br /> A new artist has just joined Conception Events.' +
        '<a href="http://conception-mypinly.rhcloud.com/conception"> Login to approve</a>' +
        '<br /><br />Have a great day' +
        '<br />Conception Robot';

    transporter.sendMail({
        from: 'noreply@conceptionevents.com',
        to: 'conceptionevents00@gmail.com',
        subject: 'Conception Events: New Artist',
        html: body
    }, function(err, status) {
        if (err) console.log(err);
        if (status) console.log('email sent');
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
            photo = (req.files.hasOwnProperty('photo')) ? req.files.photo.name : '',
            event_id = parseInt(req.body.city);


        var userInfo = {
            full_name: req.body.name,
            password: password,
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

                setTimeout(function() {
                    db.artists.save(userInfo, function(err, result) {
                        if (err) console.log('second error ' + err);
                        if (result) console.log('Added!');

                        var link = 'http://conception-mypinly.rhcloud.com/verifyemail/user/' + userInfo.user_token;

                        sendEmail(userInfo.email, userInfo.full_name, link);
                        sendAdminEmail();

                    });

                    db.events.findAndModify({
                        query: {
                            event_id: event_id
                        },
                        update: {
                            $addToSet: {
                                artists: userInfo.email
                            }
                        },
                        new: true
                    }, function(err, doc, lastErrObj) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('artist added to event: ' + doc);
                        }
                    });

                    var string = encodeURIComponent('Thank you for submitting. We would get back to you soon.');
                    res.redirect('/thank_you?data=' + string);
                }, 0);
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
        }, function(err, doc, lastErrObj) {
            if (err) {
                console.log(err);
            } else {
                var userDetails = JSON.stringify(doc);
                console.log(userDetails.artwork_1);
                var email = userDetails.email;
                var fileOne = process.env.OPENSHIFT_DATA_DIR + 'artists/' + userDetails.artwork_1;
                var fileTwo = process.env.OPENSHIFT_DATA_DIR + 'artists/' + userDetails.artwork_2;
                var fileThree = process.env.OPENSHIFT_DATA_DIR + 'artists/' + userDetails.artwork_3;
                var filePhoto = process.env.OPENSHIFT_DATA_DIR + 'artists/' + userDetails.photo;
                uploadFile(token, fileOne, userDetails.artwork_1, 1);
                uploadFile(token, fileTwo, userDetails.artwork_2, 2);
                uploadFile(token, fileThree, userDetails.artwork_3, 3);
                uploadFile(token, filePhoto, userDetails.photo, 4);

                sendPasswordEmail(email, userDetails.full_name, userDetails.password);
            }
        });

        res.send('You account is now verified. Expect an email shortly <a href="/">Back to Conception</a>');
    });

    return router;
};