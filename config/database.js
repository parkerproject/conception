require('dotenv').load();
const mongojs = require('mongojs');

const databaseUrl = process.env.MONGODB_DB_URL;
const collections = ['artists', 'events', 'sales', 'admin_users', 'artists_record'];
// var db = require('mongojs').connect(databaseUrl, collections)
const db = mongojs(databaseUrl, collections);
module.exports = db;
