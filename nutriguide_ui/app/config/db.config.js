const { MongoClient } = require('mongodb');

var uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.12";

if(!uri || !uri.includes('mongodb')) {
  console.log('[IMPORTANT] DB_URI env variable is either not set or is incorrect......kindly verify!')
} else {
  const client = new MongoClient(uri)
  client.connect();
  const db = client.db('nutriguide');
  module.exports = {
    db: db
  }
}
