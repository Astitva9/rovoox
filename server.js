const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const db = require("./models");

const app = express();

var corsOptions = {
	origin: "http://localhost:8081",
};

app.use(cors());


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// 	console.log("Drop and re-sync db.");
// });

app.get("/", (req, res) => res.send("API Running"));

//Define Routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);



const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
});
