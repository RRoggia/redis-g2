var express = require("express");
var request = require('request');
var app = express();

var redis = require('redis');
var REDIS_PORT = process.env.REDIS_PORT || 6379;
var client = redis.createClient(REDIS_PORT);

app.get("/helloWorld", function (req, res, next) {
	res.send("ola mundo\n");
});

app.get("/repos", cache, function(req, res, next) {
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
			client.setex(organization, 5, corpo.length);
			res.send("a " + organization + " tem " + corpo.length + " repositorios\n");
		}else{
			res.send(response);
		}
	});
});

function cache(req, res, next){
	var organization = req.query.org;
	client.get(organization, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.send("a " + organization + " tem " + data + " repositorios\n");
        } else {
            next();
        }
    });
}

app.listen(3000, function () {
	 console.log('app listening on port', 3000);
});
