// Keep track of our socket connection
var socket;
var response_raw;
var response;
var content;
var number;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  content = "empty";
  socket.on('body', function (data) {
    console.log("Received: " + data);
    response_raw = data;
    response = JSON.parse(response_raw);
    content = response.result;
    number = response.number;
  });
} 

function draw() {
  background(255);

  // show question

  fill(0);
  textAlign(CENTER, TOP);
  textSize(48);
  showQuestion();


  // show result

  var n = Object.keys(content).length;
  var totalWidth = windowWidth * 2 / 3;
  var width = totalWidth / (n + n - 1);
  var bottom = windowHeight * 3 / 4;

  var i = 0;
  for (var option in content){
    var count = content[option];
    var height = count * 10;
    var x = windowWidth/2 - totalWidth/2 + i * 2 * width;

    noStroke();
    fill(255,182,193);
    rect(x, bottom-height, width, height);

    fill(0);
    textAlign(CENTER, TOP);
    textSize(32);
    text(option, x + width/2, bottom + 32);
    i ++;
  }

  fill(100);
  textAlign(LEFT, TOP);
  textSize(16);
  text("sketch_ms.jc \n" + response_raw, 10, 10, windowWidth/2, windowHeight/2);
}

function showQuestion() {
  var question;
  switch(number) {
      case '2':
      question = "What is your gender?";
      text(question, windowWidth/2, 100);
          break;
      case '1':
        question = "Join";
        text(question, windowWidth/2, 100);
        break;
      default:
        break;
  }
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
}
