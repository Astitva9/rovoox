const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

const {
  checkToken
 } = require("../middleware/authJwt");

const {
check,
validationResult,
body
} = require('express-validator');

 const validate = validations => {
  return async (req, res, next) => {
   await Promise.all(validations.map(validation => validation.run(req)));
 
   const errors = validationResult(req);
   if (errors.isEmpty()) {
    return next();
   }
 
   res.status(422).json({
    errors: errors.array()
   });
  };
 };

  module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
  });

  app.get("/api/now", controller.getServerTimestamp);


  app.get("/api/user/me/:USERNAME", 
  checkToken, 
  validate([
    check('USERNAME').not().isEmpty().withMessage('Please provide the User Email.'),
  ]),
  controller.getUserdetailsByUsername);


};