// Keep track of our socket connection
var socket;
var response_raw;
var response;
var content;
var number;
var question;
var state;
var time;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  content = "empty";
  time = millis();
  state = 0;

  socket.on('body', function (data) {
    console.log("Received: " + data);
    response_raw = data;
    response = JSON.parse(response_raw);
    content = response.result;
    number = response.number;
    if (question != response.question) {
      time = millis();
      state = 0;
      question = response.question;
    }
  });
  
  socket.on('redirect', function (data) {
    console.log("Redirecting..." + data);
    window.location.href = data;
  });

  socket.on('mouse',function (data) {
    console.log("paused");
    state = 0;
  });

} 

function draw() {
  if (millis() - time > 1500) {
    state = 1;
  }
  if (state == 1) {
    update();
  }
}

function update() {
    background(255);

    // show question

    showQuestion();

    // show result
    var show = "";

    for (x in content) {
      show += content[x] + "\n";
    }

    fill(153,0,76);
    textAlign(CENTER, TOP);
    textSize(32);
    text(show, windowWidth/2, windowHeight/4);


    fill(100);
    textAlign(LEFT, TOP);
    textSize(16);
    text("show \n" + response_raw, 10, 10, windowWidth/2, windowHeight/2);

}

function showQuestion() {
  fill(0);
  textAlign(CENTER, TOP);
  textSize(48);
  var question_height = windowHeight/8;
  text("" + question, windowWidth/2-windowWidth*3/4/2, question_height, windowWidth*3/4, 200);
}

// send an int value for what page to redirect to
function mousePressed() {

  console.log("sendmouse: " + mouseX + " " + mouseY);
  
  var instruction;
  if (mouseX < windowWidth/3) {
    instruction = parseInt(number) - 1;
  } else if (mouseX > windowWidth * 2/3) {
    instruction = parseInt(number) + 1;

  } else {
    instruction = parseInt(number);
  }

  // Send that object to the socket
  socket.emit('mouse', instruction);
  state = 0;
}