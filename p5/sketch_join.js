var number = '1';

function setup() {
	socket = io.connect('http://localhost:3000');

	socket.on('redirect', function (data) {
		console.log("Redirecting..." + data);
		window.location.href = data;
	});

	createCanvas(windowWidth, windowHeight);
	background(255);
	fill(0);
	textAlign(CENTER, BOTTOM);
	textSize(48);

}

function draw() {
	text("To participate in sex ed, \nplease send \"JOYCEWANG783\" to 22333.", windowWidth/2, windowHeight/2);
}

// send an int value for what page to redirect to
function mousePressed() {

  console.log("sendmouse: " + mouseX + " " + mouseY);
  
  var instruction;
  if (mouseX < windowWidth/3) {
    instruction = parseInt(number);
  } else if (mouseX > windowWidth * 2/3) {
    instruction = parseInt(number) + 1;

  } else {
    instruction = parseInt(number);
  }

  // Send that object to the socket
  socket.emit('mouse', instruction);
}