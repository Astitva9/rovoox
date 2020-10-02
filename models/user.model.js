module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define("User", {
		username: {
			type: Sequelize.STRING,
		},
		points: {
			type: Sequelize.INTEGER,
		},
		last_claimed: {
			type: 'TIMESTAMP',
		}
	});

	return User;
};
