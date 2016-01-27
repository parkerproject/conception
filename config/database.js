// require('dotenv').load();
// var connection_string = 'dogen.mongohq.com:10014/gmail';

// if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
//   connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
// }

// var databaseUrl = process.env.MONGODB_DB_URL;
// var collections = ['artists', 'events', 'sales', 'admin_users', 'artists_record'];
// var db = require("mongojs").connect(databaseUrl, collections);

// module.exports = db;



var connection_string = '127.0.0.1:27017/conception';                                                                                      
                                                                                                                                           
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {                                                                                           
  connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;                                               
}                                                                                                                                          
                                                                                                                                           
var databaseUrl = connection_string;                                                                                                       
var collections = ['artists', 'events', 'sales', 'admin_users', 'artists_record'];                                                                           
var db = require("mongojs").connect(databaseUrl, collections);                                                                             
                                                                                                                                           
module.exports = db; 