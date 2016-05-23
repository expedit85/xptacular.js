
var welcomes = [
		"Welcome",
		"Bem-vindo",
		"Bienvenido",
		"Bienvenue",
		"Willkommen"
	];

module.exports = {


	public : function(req, res) {
		setTimeout(function() {
			return res.ok({
				message : welcomes[Date.now() % welcomes.length]
			});
		}, 1000);
	},

	getById : function(req, res) {
		// console.log(req, req.header, req.headers);
		if (!req.headers["access-token"]) return res.badRequest();

		setTimeout(function() {
			return res.ok({
				street : "R. do Alho",
				number : 89,
				city : "Rio de Janeiro",
				state : {
					code : "RJ",
					name : "Rio de Janeiro"
				}
			});
		}, 4000);
	},

	getUser : function(req, res) {
		if (!req.headers["access-token"]) return res.badRequest();
		return res.ok( {
				id : 343434,
				name : "John Doe",
				email : "john.doe@example.com",
				job : "administrator",
				image_url : "https://image.freepik.com/icones-gratis/usuario-avatar-figura-principal_318-85015.jpg"
			} );
	},

	putUser : function(req, res) {
		if (!req.headers["access-token"]) return res.badRequest();
		return res.ok();
	},

	putHouse : function(req, res) {
		if (!req.headers["access-token"]) return res.badRequest();
		return res.ok();
	},


	login : function(req, res) {
		if (!req.body.email || !req.body.password)
			return res.badRequest();

		return res.ok( {
			access_token : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsInVpZCI6MzQzNDM0LCJoaWQiOjIzMn0.kRH3Ps2Wd2UhSYKQSL_ql-_xh_R3bws1o8BbKBz-G7w"
		});
	},

	logout : function(req, res) {
		if (!req.headers["access-token"]) return res.badRequest();
		return res.ok();	
	},

};
