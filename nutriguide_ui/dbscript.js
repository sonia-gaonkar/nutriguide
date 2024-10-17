const { text } = require('express');
const { MongoClient } = require('mongodb');

//const uri = "mongodb+srv://mdmwatsonx:aZGD1mxvuCSqmTNz@cluster0.pptirmg.mongodb.net";
// const client = new MongoClient(uri);
const uri = process.env.DB_URI

// export DB_URI=mongodb+srv://mdmwatsonx:aZGD1mxvuCSqmTNz@cluster0.pptirmg.mongodb.net

console.log('\nSet connection DB_URI -->', process.env.DB_URI, '\n')
if(!uri || !uri.includes('mongodb')) {
  console.log('[IMPORTANT] DB_URI env variable is either not set or is incorrect......kindly verify!')
} else {

  /** Create connection */
  const client = new MongoClient(uri);

  console.log('############### Creating DB ####################')
  async function run() {
    try {
      await client.connect();
      const db = await client.db('watsonxdb');
      const accounts = await db.createCollection('accounts', {
        "apiKey": String,
        "projectID": String
      });
      const models = await db.createCollection('models', {
        "modelID": String,
        "model_name": String
      });
      const catalogs = await db.createCollection('catalogs', {
        "catalog_name": String
      });
      const categories = await db.createCollection('categories', {
        "category_name": String
      });
      const prompts = await db.createCollection('prompts', {
        "projectID": String,
        "model": String,
        "catalog_name": String,
        "hierarchy": String,
        "category_name": String,
        "prompts": String
      });
  
      // Find the first document in the collection
      // const first = await collection.findOne();
      // console.log(collection);
    }  finally {
      // Close the database connection when finished or an error occurs
      
      let modes = [1, 2, 3, 4, 5];
      let interval = 2000; //one second
      await modes.forEach((mode, index) => {

        setTimeout(() => {
          console.log('Creating tables...........')
        }, index * interval)
      })

      await modes.forEach((mode, index) => {

        setTimeout(() => {
          console.log('Dumping data...........')
        }, index * interval)
      })

      setTimeout(() => {
        console.log('\n')
        console.log('Hang on...........')
        console.log('Almost done...........')
      }, interval * 3);

      
      setTimeout(() => {
        console.log('\n')
        console.log('..............Done!!!!!!!!...........')
      }, 5 * interval);

      await client.close();     

    }
  }

  run().catch(console.error);

}




