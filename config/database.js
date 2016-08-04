require('dotenv').load()
var mongojs = require('mongojs')
var databaseUrl = process.env.MONGODB_DB_URL
var collections = ['artists', 'events', 'sales', 'admin_users', 'artists_record']
// var db = require('mongojs').connect(databaseUrl, collections)
var db = mongojs(databaseUrl, collections)
module.exports = db
