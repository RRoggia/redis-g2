var express = require("express");
var request = require('request');
var app = express();


app.get("/helloWorld", function (req, res, next) {
	res.send("ola mundo\n");
});

app.get("/repos",function(req, res, next) {
	var organization = req.query.org;
	var url = "https://api.github.com/orgs/" + organization + "/repos";

	var options = { 
		method: 'GET',
		url: url,
		headers: {
			'cache-control': 'no-cache',
			'User-Agent': 'rroggia'
		}
	};



	request.get(options, function(error, response, body) {
		if(error){
			res.send(error);
		} else if (response.statusCode >= 200 && response.statusCode < 300){
			var corpo = JSON.parse(body);
			console.log(corpo);
			res.send("a " + organization + " tem " + corpo.length + " repositorios\n");
		}else{
			res.send(response);
		}
	});
});

app.listen(3000, function () {
	 console.log('app listening on port', 3000);
});



