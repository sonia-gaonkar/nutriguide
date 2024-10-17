const db = require("../models");
const dbConfig = require("../config/db.config");
const ObjectId = require("mongodb").ObjectId;
const _ = require("underscore");
var bcrypt = require("bcryptjs");
var XLSX = require('xlsx')
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");


const ROLES = db.ROLES;
const User = db.user;
let API_KEY = "AIzaSyDnxvgFpJmPCmrPYM5GR3wUDEW0BnfTumY";

//Call chatQuery apis
chatQuery = async(req, res, next) => {

  console.log("....req.body.......", req.body)

  /* let watsonServerURL = req.body.watsonServerURL;
  delete req.body['watsonServerURL'];
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  //call api
  fetch(watsonServerURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${req.headers.authorization}`
    },
    body: JSON.stringify(req.body)
  })
  .then(res => Promise.all([res.status, res.json()]))
  .then(([status, jsonData]) => {
    res.response = jsonData;
    next();
  }) .catch(error => {
    return res.status(501).send({ message: error.error });
  }); */
  //req.body.chatQuery

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //const prompt = "Write a story about a magic backpack.";
  const prompt = req.body.chatQuery;

  const result = await model.generateContent(prompt);
  //console.log(result.response.text());

  //console.log(result.response);

  res.response = result.response.text();

  next();

};







//Call watsonx py apis
watsonxapi = async(req, res, next) => {

  console.log('......req.headers.authorization................', req.headers.authorization)
  console.log('..........req.body...............', req.body)

  let watsonServerURL = req.body.watsonServerURL;
  delete req.body['watsonServerURL'];
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  //call api
  fetch(watsonServerURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      //'Authorization': `Bearer ${req.headers.authorization}`
      Authorization: `#test`
    },
    body: JSON.stringify(req.body)
  })
  .then(res => Promise.all([res.status, res.json()]))
  .then(([status, jsonData]) => {

    //if(status==200) {
      //res.products = jsonData;
      //next();
    //}
    res.watsonxdata = jsonData;
    next();
  }) .catch(error => {
    return res.status(501).send({ message: error.error });
  });

  //next();

};


//save user
saveUser = async(req, res, next) => {
  
console.log('...............xxxxx...............', req.body)

  const collection = dbConfig.db.collection('users');

  if(req.body.user_id && req.body.user_id!=undefined) {
    //Update
    await collection.findOneAndUpdate(
      { "_id": new ObjectId(req.body.user_id) },
      {
        $set: req.body
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    )
  }else {
    //Create
    await collection.insertOne(req.body); 
  }
   next();
};


//get all users
allUsers = async(req, res, next) => {

  if(req.params && req.params.id) {
    req.query._id = new ObjectId(req.params.id)
  }
  const collection = dbConfig.db.collection('users');
  res.allUsers = await collection.find(req.query).toArray();

  next();
};



//export
const datamgr = {
  chatQuery,
  watsonxapi,
  saveUser,
  allUsers
};

module.exports = datamgr;
