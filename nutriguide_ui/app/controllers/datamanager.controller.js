exports.chatQuery = (req, res) => {
  res.status(200).send({
    "response": res.response
  });
};

exports.watsonxapi = (req, res) => {
  res.status(200).send({
    "watsonxdata": res.watsonxdata
  });
};

exports.saveUser = (req, res) => {
  res.status(200).send({
    "status" : "ok"
  });
};

exports.allUsers = (req, res) => {
  res.status(200).send({
    "users": res.allUsers
  });
};