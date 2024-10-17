const { datamgr } = require("../middlewares");
const controller = require("../controllers/datamanager.controller");
//const  multipart  =  require("connect-multiparty");
//const  multipartMiddleware  =  multipart({ uploadDir:  './../documents' });


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/v1/data/chatQuery", [ datamgr.chatQuery ], controller.chatQuery);

  //Watsonx API
  app.post("/api/v1/data/analysis", [ datamgr.watsonxapi ], controller.watsonxapi);

   /* Save User  */
   app.post("/api/v1/data/users", [ datamgr.saveUser ], controller.saveUser );

   //get all users
   app.get("/api/v1/data/users", [ datamgr.allUsers ], controller.allUsers );

   //get user by id
   app.get("/api/v1/data/users/:id", [datamgr.allUsers], controller.allUsers );

};
