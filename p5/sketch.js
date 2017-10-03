// Keep track of our socket connection
var socket;
var content;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0,0,255);
      noStroke();
      ellipse(data.x,data.y,80,80);
    }
  );

  socket.on('body', function (data) {
    console.log("Received: " + data)
    content = data;
  });
  content = "empty";
}

function draw() {
  background(255);
  text("there is: " + content, 10, 10, windowWidth/2, windowHeight/2);
}

function mouseDragged() {
  // Draw some white circles
  fill(255,100);
  noStroke();
  ellipse(mouseX,mouseY,80,80);
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse', "hello");
}