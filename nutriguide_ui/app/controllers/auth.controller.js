const config = require("../config/auth.config");
const db = require("../models");
const dbConfig = require("../config/db.config");
const ObjectId = require("mongodb").ObjectId;
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const _ = require("underscore");

const userCollection = dbConfig.db.collection('users');

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

/* Start - Signin function */
exports.signin = async(req, res) => {
  userData = await userCollection.findOne({ "username": req.body.username});

  if(!userData && userData==null) {
    return res.status(401).send({ message: "You have entered an invalid username or password!" });
  }else {

    //Validate password
    let passwordIsValid = bcrypt.compareSync(
      atob(req.body.password),
      userData.password 
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "You have entered an invalid username or password!" });
    }

    //Create jwt token
    const token = jwt.sign({ id: userData.id },
                          config.secret,
                          {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                        });
    req.session.token = token;
    //let roleData = await getRoles(userData.roles[0]);
    res.status(200).send({
      id: userData._id,
      username: userData.username,
      email: userData.email,
      token: token,
      is_admin: userData.is_admin,
      //roles: roleData,
    });
  }
};
/* End - Signin function */


/* Start - Signout function */
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
/* End - Signout function */


/* Start - validateToken function - for watsonx python apis*/
exports.validateToken = async (req, res) => {
  res.status(200).send({ status: "Ok" });
};
/* End - validateToken function - for watsonx python apis*/


