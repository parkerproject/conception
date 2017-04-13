/**
 * Module dependencies
 */
require('dotenv').load();

const express = require('express');

const db = require('../config/database.js');
const passport = require('passport');

const router = new express.Router();
require('../config/passport')(passport, db);
require('./admin')(router, passport, db);
require('./new_admin')(router, passport, db);
require('./artist')(router, passport, db);
require('./event')(router, passport, db);
require('./events')(router, passport, db);


module.exports = router;
