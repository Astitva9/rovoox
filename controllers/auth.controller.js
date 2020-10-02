
const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Op = db.Sequelize.Op;
const moment = require('moment');

exports.signup = async (req, res) => {
  
  const body = req.body;

  try {

    var result = await User.create({
      username: body.USERNAME,
      points: 0,
      last_claimed:''
    });

    let user_details=JSON.parse(JSON.stringify(result));

    if(user_details){

      const jsontoken = jwt.sign({
        result: body.USERNAME
       }, "rovoox", {
        expiresIn: "24h"
       });

       return res.status(200).json({
        status: true,
        message: "Registered successfully",
        token: jsontoken,
      });
      
    }else{

      return res.status(500).json({
        status: false,
        message: 'Something went Wrong'
       });

    }
    
  } catch (error) {

    return res.status(500).json({
      status: false,
      message: error
     });
    
  }  

};
