var sw = require('stopword'),
	fs = require('fs'),
	request = require('request');
var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var url = require('url');
var path = require('path');

var key = "joycewang783";
var secret = "howtoputonasock";

var pollID;
var type;
var n = '0';

app.get('/:n', function(req, res){
	if ((req.params.n).length == 1) {
		n = req.params.n;
	}

	function callback(error, response, body) {
		var pathname = req.url;
		pathname = '/index_p5.html';
		var ext = path.extname(pathname);
		var typeExt = {
			'.html': 'text/html',
			'.js':   'text/javascript',
			'.css':  'text/css'
		};
		var contentType = typeExt[ext] || 'text/plain';
		fs.readFile(__dirname + pathname,
		    // Callback function for reading
		    
		    function (err, data) {
		      // if there is an error
		      if (err) {
		        res.writeHead(500);
		        return res.end('Error loading ' + pathname);
		      }
		      // Otherwise, send the data, the contents of the file
		      res.writeHead(200,{ 'Content-Type': contentType });
		      res.end(data);
		    }
	  	);
	}
	request({}, callback);
});
''
app.get('/:folder/:file/', function(req, res){
	var file = req.params.file;
	var folder = req.params.folder;

	if (folder == 'p5') {
		console.log("\nLoading p5 sketches...", end="");

		function callback(error, response, body) {
			var pathname = req.url;
			var ext = path.extname(pathname);
			var typeExt = {
				'.html': 'text/html',
				'.js':   'text/javascript',
				'.css':  'text/css'
			};
			console.log("pathname: " + pathname);
			var contentType = typeExt[ext] || 'text/plain';

			if (isNaN(parseInt(n)) || parseInt(n) <= 1) {
				pathname = "/p5/sketch_join.js";
			} else {
				if (type == "multiple_choice_polls") {
					pathname = "/p5/sketch_mc.js";
				} else {
					pathname = "/p5/sketch_fr.js";
				}
			}

			fs.readFile(__dirname + pathname,
			    // Callback function for reading
			    
			    function (err, data) {
			      // if there is an error
			      console.log("Reading..." + __dirname + pathname);
			      if (err) {
			        res.writeHead(500);
			        return res.end('Error loading ' + pathname);
			      }
			      // Otherwise, send the data, the contents of the file
			      res.writeHead(200,{ 'Content-Type': contentType });
			      res.end(data);
			    }
		  	);
		}

	}

	request({}, callback);
});


var port = process.env.PORT || 3000;

server.listen(port);

io.on('connection', function(socket) {
	setInterval(function(){
		if (isNaN(parseInt(n)) || parseInt(n) < 1) {
			//console.log("parseInt(n) = " + parseInt(n));
			return;
		}
		var i = parseInt(n);
		var info = cues[i];
		pollID = info.pollID;
		type = info.type;

		//console.log("Looking up: " + n + " " + 'https://www.polleverywhere.com/'+ type + '/' + pollID + '/results');
		var options = {
			url: 'https://www.polleverywhere.com/'+ type + '/' + pollID + '/results',
			headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': "Basic " + new Buffer(key + ":" + secret, "utf8").toString("base64"), // insert auth key here - make auth key by combining username and password
			}
		};

		function callback(error, response, body) {
			if (error) {
				console.log("Callback error...");
				return;
			}
			
			var info;
			try {
				info = JSON.parse(body);
			}
			catch(err) {
			  	console.log("Parsing error..." + body);
			  	return;
			}
			
		    if (type == "multiple_choice_polls") {
				var result = {} ;
			    for (var attributename in info){	
			    	for(var key in info[attributename]){
			    		if (key == "value") {
			    			var choice = info[attributename][key];
			    			if (!(choice in result)) {
			    				result[choice] = 0;
			    			}
			    			var count = result[choice];
			    			count = count + 1;
			    			result[choice] = count;
			    		}
			    	}
				}
				var response = {};
				response.number = n;
				response.result = result;
				if (isNaN(parseInt(n))|| parseInt(n) < 1) {
					console.log("parseInt(n) = " + parseInt(n));
				}
				response.question = cues[parseInt(n)].question;
				io.emit('body', JSON.stringify(response));

		    } else {
		    	text = "";
			    for(var attributename in info){
			    	for(var key in info[attributename]){
			    		if (key == "value") {
			    			text += (info[attributename][key] + ";");
			    		}
			    	}
				}
				var response = {};
				response.number = n;
				response.result = text.split(";");
				if (isNaN(parseInt(n))|| parseInt(n) < 1) {
					console.log("parseInt(n) = " + parseInt(n));
				}
				response.question = cues[parseInt(n)].question;
				io.emit('body', JSON.stringify(response));
		    }
			
		}

		request(options, callback);

	}, 100);
	
	console.log('Client connected');
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });

    socket.on('mouse',
      function(data) {
        console.log("Received: 'mouse' " + data);
      	if (isNaN(parseInt(data))) {
			console.log("Woahhhh...mouse wrong");
			return;
		} else if (parseInt(data) < 1 || parseInt(data) > 10) {
			console.log("Question doesn't exist yet.");
			return;
		} else {
			var i = parseInt(data);
			var info = cues[i];
			n = data;
			pollID = info.pollID;
			type = info.type;
		}
		io.emit("redirect", "http://localhost:3000/" + data);
      }
    );
});

var cues = [
	{
		// index filler
	},
	{
    	pollID:'2T50inzOqhv6uX6',
    	type:'multiple_choice_polls',
    	question: "Join",
	},
	{
    	pollID:'2T50inzOqhv6uX6',
    	type:'multiple_choice_polls',
    	question: 'What is your gender?',
	},
	{
		question:'What is your sexual orientation?',
    	pollID:'9pyzInmwzatKPoA',
    	type:'multiple_choice_polls',
	},
	{
		question:'What is your home state?',
    	pollID:'OGLrKg1ruzdzlDn',
    	type:'free_text_polls',
	},
	{
		question: 'Did you receive sex education in middle school?',
    	pollID: 'Baq9vEbgZljNpWk',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Do you feel comfortable talking about sex with your friends?',
    	pollID: 'PaxyY0KJLldGxqP',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Do you feel comfortable talking about sex with your parent(s)/guardian(s)?',
    	pollID: 'A7qSa1EhF4L00cA',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Do you feel comfortable talking about sex here?',
    	pollID: 'i7OivQYje2tc8Xa',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'What does \"sexual and reproductive body parts and their functions\" mean to us?',
    	pollID: 'YVleNpg64N6sGx9',
    	type: 'free_text_polls',
	},
	{
		question: 'Have you ever been in a relationship?',
    	pollID: 'jEGkNYTnGsDnq7F',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Are you currently in a relationship? ',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Are you happy with your relationship status?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Do you know a teen who has contracted HIV or another STI?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'Do you want to watch it?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'How comfortable would you be with talking with a sexual partner about condoms?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'How comfortable would you be with using a condom with a sexual partner?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'How comfortable would you be with talking to a sexual partner about what you are comfortable doing sexually?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'How comfortable would you be with talking to a sexual partner about what feels good to you?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'How comfortable would you be with saying \"no\" if someone tried to pressure you to do something sexually that you didn’t want to do?',
    	pollID: '',
    	type: 'multiple_choice_polls',
	},
	{
		question: 'What are some ways of making condoms more pleasurable?',
    	pollID: '',
    	type: 'free_text_polls',
	},
	{
		question: 'What should I do?',
    	pollID: '',
    	type: '',
	},
	{
		question: 'Why?',
    	pollID: '',
    	type: '',
	},
]