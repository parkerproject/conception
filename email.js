#!/bin/env node

require('dotenv').load();
var nodemailer = require('nodemailer');
//var mandrill = require('node-mandrill')(process.env.MANDRILL_KEY);

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'conceptionevents00@gmail.com',
    pass: 'conceptionevents123'
  }
});


function mailOptions(email, title, body) {
  var options = {
    from: 'noreply@conceptionevents.com', // sender address 
    to: email,
    subject: title,
    //text: body
    html: body
  };

  return options;
}



function sendEmail(email, name, link) {

  var emailHtml = 'Hi <b>' + name + '</b><br /><br />' +
    '<i>Welcome to Conception Events</i>!<br />' +
    '<br />Hey,thanks for submitting your artwork! Please verify your email by clicking this ' + link +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: Activate your account';

  var _options = mailOptions(email, title, emailHtml);

  transporter.sendMail(_options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  //   mandrill('/messages/send', {
  //     message: {
  //       to: [{
  //         email: email
  //       }],
  //       from_email: 'noreply@conceptionevents.com',
  //       from_name: 'Conception Events',
  //       subject: 'Conception Events: Activate your account',
  //       html: emailHtml
  //     }
  //   }, function(error, response) {
  //     //uh oh, there was an error
  //     if (error) console.log(JSON.stringify(error));

  //     //everything's good, lets see what mandrill said
  //     else console.log(response);
  //   });
}


function sendPasswordEmail(toEmail, name, password) {

  var emailHtml = 'Hi <b>' + name + '</b>' +
    '<br /><br /><em>Your login details below</em>' +
    '<br />Your username is ' + toEmail +
    '<br />Your password is ' + password +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: Login details';

  var _options = mailOptions(toEmail, title, emailHtml);

  transporter.sendMail(_options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  //   mandrill('/messages/send', {
  //     message: {
  //       to: [{
  //         email: toEmail
  //       }],
  //       from_email: 'noreply@conceptionevents.com',
  //       from_name: 'Conception Events',
  //       subject: 'Conception Events: Login details',
  //       html: emailHtml
  //     }
  //   }, function(error, response) {
  //     //uh oh, there was an error
  //     if (error) console.log(JSON.stringify(error));

  //     //everything's good, lets see what mandrill said
  //     else console.log(response);
  //   });
}

function sendNewPasswordEmail(toEmail, name, password) {

  var emailHtml = 'Hi <b>' + name + '</b>' +
    '<br />Your new password is ' + password +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: New Password';

  var _options = mailOptions(toEmail, title, emailHtml);

  transporter.sendMail(_options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  //   mandrill('/messages/send', {
  //     message: {
  //       to: [{
  //         email: toEmail
  //       }],
  //       from_email: 'noreply@conceptionevents.com',
  //       from_name: 'Conception Events',
  //       subject: 'Conception Events: New Password',
  //       html: emailHtml
  //     }
  //   }, function(error, response) {
  //     //uh oh, there was an error
  //     if (error) console.log(JSON.stringify(error));

  //     //everything's good, lets see what mandrill said
  //     else console.log(response);
  //   });
}


function sendAdminEmail() {

  var body = 'Hey buddy!<br /><br /> A new artist has just joined Conception Events.' +
    '<a href="http://www.conceptionevents.com/admin"> Login to approve</a>' +
    '<br /><br />Have a great day' +
    '<br />Conception Robot';

  var title = 'Conception Events: New Artist';
  var toEmail = 'info@conceptionevents.com';

  var _options = mailOptions(toEmail, title, body);

  transporter.sendMail(_options, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: ' + info.response);
    }
  });

  //   mandrill('/messages/send', {
  //     message: {
  //       to: [{
  //         email: 'info@conceptionevents.com'
  //       }],
  //       from_email: 'noreply@conceptionevents.com',
  //       from_name: 'Conception Events',
  //       subject: 'Conception Events: New Artist',
  //       html: body
  //     }
  //   }, function(error, response) {
  //     //uh oh, there was an error
  //     if (error) console.log(JSON.stringify(error));

  //     //everything's good, lets see what mandrill said
  //     else console.log(response);
  //   });
}


module.exports.sendAdminEmail = sendAdminEmail;
module.exports.sendPasswordEmail = sendPasswordEmail;
module.exports.sendEmail = sendEmail;
module.exports.sendNewPasswordEmail = sendNewPasswordEmail;