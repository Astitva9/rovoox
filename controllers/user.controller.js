const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;
var fs = require('fs');
var bcrypt = require("bcryptjs");
var salt = 10;
const moment = require('moment');

const {
	sign,
	decode
   } = require("jsonwebtoken");



    exports.getServerTimestamp= async (req, res) => {
	
		try {

			return res.status(200).json({
				status: true,
				timestamp: moment().format()
			});
			
		} catch (error) {

			return res.status(500).json({
				status: true,
				data: 'Something went wrong!!'
			});
			
		}

	}
	
	exports.getUserdetailsByUsername = async (req,res) => {

		const user_name = req.params.USERNAME
	
		if (user_name) {
	
			var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name},attributes: ['username', 'points']})));
	
			console.log('result',user_details);
	
			if(user_details){
	
				return res.status(200).json({
					status: true,
					user_details: user_details,
				});
	
			}else{
				return res.status(404).json({
					status: false,
					message: 'User detail not found'
					});
			}
	
		}else{
			return res.status(500).json({
				status: false,
				message: 'Something went Wrong'
				});
		}
		
	
	};
