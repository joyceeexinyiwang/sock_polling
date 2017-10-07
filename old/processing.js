//	run following in terminal:
//  $ cd Dropbox/works_cur/how_to_put_on_a_sock/process/polling2
//	$ nodemon index.js
//
// 	[example]
//	put in browser:
//	using this web app: http://localhost:3000/free_text_polls/qIRzIUTRZNIC90O
//	PE website: https://www.polleverywhere.com/free_text_polls/qIRzIUTRZNIC90O
//
//	using this web app: http://localhost:3000/multiple_choice_polls/2T50inzOqhv6uX6
//	https://www.polleverywhere.com/multiple_choice_polls/2T50inzOqhv6uX6

//  -------------------------------------------------------------------
//
//  references:
//	adapted from Michael James's code for Jane Doe
// 	https://stackoverflow.com/questions/33294150/emit-to-all-sockets-on-regular-interval-in-socket-io
//  https://socket.io/docs/
//  https://api.polleverywhere.com/#authentication
// 
//	visualization tools:
// 	https://p5js.org/
// 	https://d3js.org/
//	https://threejs.org/


//	https://github.com/processing/p5.js/wiki/p5.js,-node.js,-socket.io
//
//  -------------------------------------------------------------------


var sw = require('stopword'),
	fs = require('fs'),
	request = require('request');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var key = "joycewang783";
var secret = "howtoputonasock";

var pollID;
var type;

app.get('/', function(req, res){
	pollID = "2T50inzOqhv6uX6";
	type = "multiple_choice_polls";

	if (type == 'free_text_polls') {
		function callback(error, response, body) {
	  		res.sendFile(__dirname + '/index.html');
		}
	}
	if (type == 'multiple_choice_polls') {
		function callback(error, response, body) {
	  		res.sendFile(__dirname + '/mc.html');
		}
	}

	request({}, callback);
});

var port = process.env.PORT || 3000;

server.listen(port);

io.on('connection', function(socket) {
	setInterval(function(){

		var options = {
			url: 'https://www.polleverywhere.com/'+ type + '/' + pollID + '/results',
			headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64"), // insert auth key here - make auth key by combining username and password
			}
		};

		function callback(error, response, body) {
			var info = JSON.parse(body);

		    var text = "";

		    for(var attributename in info){
		    	text += "<br>";
		    	for(var key in info[attributename]){
		    		if (key == "value") {
		    			text += (info[attributename][key] + " ");
		    		}
		    	}
			}

			const result = "Poll ID: " + pollID + 
								"<br>Type: " + type + 
								//"<br>Error: " + error + 
								//"<br>Response: " + response + 
								"<br><br>Body: " + text;
			io.emit('body', text);
		}

		request(options, callback);

	}, 500);
	
	console.log('Client connected');

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});