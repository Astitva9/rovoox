const db = require("../models");
const User = db.users;
var rsepo={};

checkDuplicateUserName = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.USERNAME
    }
  }).then(user => {
    if (user) {
        rsepo.status="error";
        rsepo.message="Failed! User Name is already in use!";
        res.status(400).send(rsepo);
        return;
    }
    next();
  });
};



const verifySignUp = {
  checkDuplicateUserName: checkDuplicateUserName,
};

module.exports = verifySignUp;