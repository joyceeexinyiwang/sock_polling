//	run following in terminal:
//  $ cd Dropbox/works_cur/how_to_put_on_a_sock/sock_polling
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
//	connecting p5.js,-node.js,-socket.io:
//	https://github.com/processing/p5.js/wiki/p5.js,-node.js,-socket.io
//
//	visualization tools:
// 	https://p5js.org/
// 	https://d3js.org/
//	https://threejs.org/
//
//  -------------------------------------------------------------------


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
	n = req.params.n;

	function callback(error, response, body) {
		var pathname = req.url;
		console.log(pathname);
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
		      console.log(__dirname + pathname);
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
		console.log("\nLoading p5 sketches...");

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
			if (n == 3) {
				pathname = "/p5/sketch2.js";

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

		console.log("\n");
	}

	request({}, callback);
});


var port = process.env.PORT || 3000;

server.listen(port);

io.on('connection', function(socket) {
	setInterval(function(){
		switch(n) {
		    case '1':
				pollID = 'qIRzIUTRZNIC90O';
				type = 'free_text_polls';
		        break;
		    case '2':
		    	pollID = '2T50inzOqhv6uX6';
		    	type = 'multiple_choice_polls';
		    	break;
		    default:
		    	break;
		}
		console.log("Looking up: " + n + " " + type + "/" + pollID);
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
		    if (type == "multiple_choice_polls") {

		    	var A = 0;
		    	var B = 0;
		    	var C = 0;
		    	var D = 0;

		    	for(var attributename in info){
			    	text += "<br>";
			    	for(var key in info[attributename]){
			    		if (key == "value") {
			    			switch (info[attributename][key]){
								case "Female":
									A += 1;
			    					break;
								case "Male":
									B += 1;
			    					break;								
			    				case "Non-binary":
									C += 1;
			    					break;								
			    				case "Other":
									D += 1;
			    					break;
			    			}
			    		}
			    	}
				}
				io.emit('A', A);
				io.emit('B', B);
				io.emit('C', C);
				io.emit('D', D);
				io.emit('body', "A:" + A + " B: " + B + " C: " + C + "D: " + D);

		    } else {
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
				console.log(text);
		    }
			
		}

		request(options, callback);

	}, 500);
	
	console.log('Client connected');
    
    socket.on('disconnect', function() {
      console.log("Client has disconnected");
    });
});