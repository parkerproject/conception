#!/bin/env node

var nodemailer = require('nodemailer');


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
    user: 'postmaster@mg.conceptionevents.com',
    pass: process.env.MAIL_GUN_PASS
  }
});



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

module.exports.sendAdminEmail = sendAdminEmail;
module.exports.sendPasswordEmail = sendPasswordEmail;
module.exports.sendEmail = sendEmail;