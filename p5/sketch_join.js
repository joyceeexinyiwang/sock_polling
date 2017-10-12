var number = '1';

var q;

function setup() {
	socket = io.connect('http://localhost:3000');

	socket.on('redirect', function (data) {
		console.log("Redirecting..." + data);
		window.location.href = data;
	});

	q = "";
	
	createCanvas(windowWidth, windowHeight);
	background(255);
	fill(0);
	textAlign(CENTER, BOTTOM);
	textSize(48);

}

function draw() {
	text("To participate, \nplease send \"JOYCEWANG783\" to 22333.", windowWidth/2, windowHeight/2);
}

function keyTyped() {

  console.log("received key: " + key + " " + (key+"").charCodeAt(0));
  
  var instruction;
  if ((key+"").charCodeAt(0) >= 48 && (key+"").charCodeAt(0) <= 57) {
      q = q + key;
  } else {
      if (keyCode == LEFT_ARROW) {
        instruction = parseInt(number);
      } else if (keyCode == RIGHT_ARROW) {
        instruction = parseInt(number) + 1;
      } else if (keyCode == RETURN) {
        if (q != "") {
          instruction = parseInt(q);
          q = "";
        } else {
          instruction = parseInt(number)
        }
      } 
      console.log("send instruction: " + instruction);
      // Send that object to the socket
      socket.emit('mouse', instruction);
      state = 0;
  }
}