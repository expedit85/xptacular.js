var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {

	// console.log("REQUEST");
	// console.log(req.body, req.headers, req.params);

	res.ok = function(data) {
		return res.json(data || null);
	};

	res.badRequest = function(data) {
		return res.status(400).json(data || null);
	};

	next();
});

app.use(express.static('../'));
app.use(express.static('./'));


var TheController = require('./TheController.js');

app.get("/api/1.0/public", TheController.public);

app.post("/api/1.0/user/login", TheController.login);
app.post("/api/1.0/user/:uid/logout", TheController.logout);

app.get("/api/1.0/user/:uid", TheController.getUser);
app.put("/api/1.0/user/:uid", TheController.putUser);

app.get("/api/1.0/user/:uid/house/:hid", TheController.getById);
app.put("/api/1.0/user/:uid/house/:hid", TheController.putHouse);


/* Sails routes:

  "GET /api/1.0/public" : "TheController.public",

  "POST /api/1.0/user/login" : "TheController.login",
  "POST /api/1.0/user/:uid/logout" : "TheController.logout",

  "GET /api/1.0/user/:uid" : "TheController.getUser",
  "PUT /api/1.0/user/:uid" : "TheController.putUser",

  "GET /api/1.0/user/:uid/house/:hid" : "TheController.getById",
  "PUT /api/1.0/user/:uid/house/:hid" : "TheController.putHouse",

*/