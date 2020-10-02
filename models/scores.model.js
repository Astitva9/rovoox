module.exports = (sequelize, Sequelize) => {
	const User_Scores = sequelize.define("User_Scores", {
		username: {
			type: Sequelize.STRING,
		},
		score: {
			type: Sequelize.INTEGER,
		}
	});

	return User_Scores;
};
