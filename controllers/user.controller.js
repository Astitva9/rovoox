const db = require("../models");
const Users = db.users;
const Scores =db.scores;
const Op = db.Sequelize.Op;
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

		const user_name = req.params.USERNAME;
	
		if (user_name) {
	
			var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name},attributes: ['username', 'points']})));
		
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

	exports.gamePlay = async (req,res) => {

		const user_name = req.body.USERNAME
	
		if (user_name) {
			//get random score for user
			var random_score = Math.floor(Math.random() * (100 - 1 + 1) + 1);
			
			//check that user hasn't cross the play limit which is 5 per hour

			var game_count = await db.sequelize.query("select COUNT(*) as GAME_COUNT from User_Scores where date(now() ) = date(User_Scores.createdAt) and hour(now() ) = hour(User_Scores.createdAt) and username='"+user_name+"' ", { type: db.sequelize.QueryTypes.SELECT });
			
	
			if(game_count[0].GAME_COUNT<5){

				//store game count to scores table

				var result = await Scores.create({
					username: user_name,
					score: random_score
				});

				//update  total score and last claimed timestamp

				var pass_data = await db.sequelize.query("UPDATE `Users` SET `points`=`points`+"+random_score+" ,`last_claimed`=CURRENT_TIMESTAMP WHERE `username`='"+user_name+"'");

				if(result && pass_data){

					var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name},attributes: ['points']})));

					return res.status(200).json({
						status: true,
						point_scored: 'User Scored :'+random_score,
						total_score:user_details.points
					});
		
				}else{

					return res.status(500).json({
						status: false,
						data: 'Something Went Wrong!!',
					});
		
				}
	
				
			}else{
				return res.status(404).json({
					status: false,
					message: 'Access denied!! Per Hour Limit Exceeded.'
					});
			}
	
		}else{
			return res.status(500).json({
				status: false,
				message: 'Something went Wrong'
			});
		}
		
	
	};

	exports.claimBonus = async (req,res) => {

		const user_name = req.body.USERNAME
	
		if (user_name) {

			//get the last claimed timestamp and registartion timestamp
			var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name}})));

			var current_datetime= moment();

			if(user_details.last_claimed!== ''){

				var claim_from= moment(user_details.last_claimed);

			}else{

				var claim_from= moment(user_details.createdAt);

			}

			//get difference in minutes

			var user_minutes = current_datetime.diff(claim_from, 'minutes');

			var claimable_score = user_minutes*10;

			var claim_score = 0;

			if(claimable_score>100){
				claim_score=100;
			}else{
				claim_score=claimable_score;
			}

			//update  total score and last claimed timestamp

			var pass_data = await db.sequelize.query("UPDATE `Users` SET `points`=`points`+"+claim_score+" ,`last_claimed`=CURRENT_TIMESTAMP WHERE `username`='"+user_name+"'");

			if(pass_data){

				var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name},attributes: ['points']})));

				return res.status(200).json({
					status: true,
					point_scored: 'User Scored :'+claim_score,
					total_score:user_details.points
				});
	
			}else{

				return res.status(500).json({
					status: false,
					data: 'Something Went Wrong!!',
				});
	
			}
		
				
	
		}else{
			return res.status(500).json({
				status: false,
				message: 'Something went Wrong'
			});
		}
		
	
	};

	exports.getLeaderBoard = async (req,res) => {

		//First get the top 10 players

		var top_palyer = await db.sequelize.query("SELECT username,points,1+(SELECT count(*) from Users a WHERE a.points > b.points) as RNK FROM Users b ORDER BY points DESC LIMIT 10", { type: db.sequelize.QueryTypes.SELECT });

		let jwttoken = req.get("authorization");

		if (jwttoken) {

			jwttoken = jwttoken.slice(7);

			let user_name = decode(jwttoken);

			if (user_name && user_name.result != null) {

				var user_details = JSON.parse(JSON.stringify(await Users.findOne({where: {username:  user_name.result}})));

				if(user_details){

					var player_postion = await db.sequelize.query("SELECT username,points,1+(SELECT count(*) from Users a WHERE a.points > b.points) as RNK FROM Users b where username='"+user_name.result+"'", { type: db.sequelize.QueryTypes.SELECT });
					

				}else{
				
				}
			}
		}


		return res.status(200).json({
			status: true,
			leaderBoard:top_palyer,
			current_user_position:(player_postion)?player_postion:null
		});

		
	
	};
