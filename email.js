#!/bin/env node

require('dotenv').load();
//var nodemailer = require('nodemailer');
//var mandrill = require('node-mandrill')(process.env.MANDRILL_KEY);
var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('key-97a7f5bf665273923e9755932a209d03');


function mailOptions(email, title, body) {
  var options = {
    from: 'noreply@conceptionevents.com', // sender address 
    to: email,
    subject: title,
    //text: body
    html: body
  };
	
	mg.sendRaw('noreply@conceptionevents.com', [email],
  'From: noreply@conceptionevents.com' +
  '\nTo: ' + email +
  '\nContent-Type: text/html; charset=utf-8' +
  '\nSubject: '+ email +
  '\n\n' + body,
  function(err) {
    //err && console.log(err)
  });

  return options;
}



function sendEmail(email, name, link) {

  var emailHtml = 'Hi <b>' + name + '</b><br /><br />' +
    '<i>Welcome to Conception Events</i>!<br />' +
    '<br />Hey,thanks for submitting your artwork! Please verify your email by clicking this ' + link +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: Activate your account';

	mg.sendRaw('noreply@conceptionevents.com', [email],
  'From: noreply@conceptionevents.com' +
  '\nTo: ' + email +
  '\nContent-Type: text/html; charset=utf-8' +
  '\nSubject: '+ title +
  '\n\n' + emailHtml,
  function(err) {
    if (err) console.log(err);
  });

}


function sendPasswordEmail(toEmail, name, password) {

  var emailHtml = 'Hi <b>' + name + '</b>' +
    '<br /><br /><em>Your login details below</em>' +
    '<br />Your username is ' + toEmail +
    '<br />Your password is ' + password +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: Login details';


  mg.sendRaw('noreply@conceptionevents.com', [toEmail],
  'From: noreply@conceptionevents.com' +
  '\nTo: ' + toEmail +
  '\nContent-Type: text/html; charset=utf-8' +
  '\nSubject: '+ title +
  '\n\n' + emailHtml,
  function(err) {
    if (err) console.log(err);
  });
}

function sendNewPasswordEmail(toEmail, name, password) {

  var emailHtml = 'Hi <b>' + name + '</b>' +
    '<br />Your new password is ' + password +
    '<br /><br />Have a great day' +
    '<br />Conception Team';

  var title = 'Conception Events: New Password';

  mg.sendRaw('noreply@conceptionevents.com', [toEmail],
  'From: noreply@conceptionevents.com' +
  '\nTo: ' + toEmail +
  '\nContent-Type: text/html; charset=utf-8' +
  '\nSubject: '+ title +
  '\n\n' + emailHtml,
  function(err) {
    if (err) console.log(err);
  });



}


function sendAdminEmail() {

  var body = 'Hey buddy!<br /><br /> A new artist has just joined Conception Events.' +
    '<a href="http://www.conceptionevents.com/admin"> Login to approve</a>' +
    '<br /><br />Have a great day' +
    '<br />Conception Robot';

  var title = 'Conception Events: New Artist';
  var toEmail = 'info@conceptionevents.com';

  mg.sendRaw('noreply@conceptionevents.com', [toEmail],
  'From: noreply@conceptionevents.com' +
  '\nTo: ' + toEmail +
  '\nContent-Type: text/html; charset=utf-8' +
  '\nSubject: '+ title +
  '\n\n' + body,
  function(err) {
    if (err) console.log(err);
  });


}


module.exports.sendAdminEmail = sendAdminEmail;
module.exports.sendPasswordEmail = sendPasswordEmail;
module.exports.sendEmail = sendEmail;
module.exports.sendNewPasswordEmail = sendNewPasswordEmail;