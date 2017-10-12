// Keep track of our socket connection
var socket;
var response_raw;
var response;
var content;
var number;
var question;
var state;
var time;

var q;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  content = "empty";
  time = millis();
  //state = 0;

  q = "";

  socket.on('body', function (data) {
    console.log("Received: " + data);
    response_raw = data;
    response = JSON.parse(response_raw);
    content = response.result;
    number = response.number;
    if (question != response.question) {
      time = millis();
      //state = 0;
      question = response.question;
    }
  });
  
  socket.on('redirect', function (data) {
    console.log("Redirecting..." + data);
    window.location.href = data;
  });

  socket.on('mouse',function (data) {
    console.log("paused");
    //state = 0;
  });
} 

function draw() {
  background(255);
  showQuestion();
  if (millis() - time > 1500) {
    //state = 1;
    update();
  }
  //if (state == 1) {
  //  update();
  //}
}

function update() {
  // show result

  var n = Object.keys(content).length;
  var totalWidth = windowWidth * 2 / 3;
  var width = totalWidth / (n + n - 1);
  var bottom = windowHeight * 3 / 4;

  var i = 0;

  // draw options A, B, C, D

  for (var option in content){
    var count = content[option]-1;
    var height = count * 10;
    var x = windowWidth/2 - totalWidth/2 + i * 2 * width;

    fill(0);
    textAlign(CENTER, TOP);
    textSize(20);
    text(option, x, bottom + 32*2, width, 60);

    textSize(28);
    var c = getColor(i);
    fill(c)
    text(String.fromCharCode(65+i), x, bottom + 28, width, 40);

    i ++;
  }

  // draw rectangles

  i = 0;
  for (var option in content){
    var count = content[option]-1;
    var height = count * 10;
    var x = windowWidth/2 - totalWidth/2 + i * 2 * width;

    noStroke();
    fill(255,182,193);
    rect(x, bottom-height, width, height);

    textAlign(CENTER, TOP);
    textSize(20);
    text(count, x, bottom-height-40, width, 40);

    i++;
  }

  fill(100);
  textAlign(LEFT, TOP);
  textSize(16);
  text("sketch_ms.jc \n" + response_raw, 10, 10, windowWidth/2, windowHeight/2);
}


function showQuestion() {
  fill(0);
  textAlign(CENTER, TOP);
  textSize(48);
  var question_height = windowHeight/8;
  text("" + question, windowWidth/2-windowWidth*3/4/2, question_height, windowWidth*3/4, 200);
}

function keyTyped() {

  console.log("received key: " + key + " " + (key+"").charCodeAt(0));
  
  var instruction;
  if ((key+"").charCodeAt(0) >= 48 && (key+"").charCodeAt(0) <= 57) {
      q = q + key;
  } else {
      console.log("instruction.... ");
      if (keyCode == LEFT_ARROW) {
        instruction = parseInt(number) - 1;
      } else if (keyCode == RIGHT_ARROW) {
        instruction = parseInt(number) + 1;
      } else if (keyCode == RETURN) {
        instruction = parseInt(q);
        q = "";
      } 
      console.log("send instruction: " + instruction);
      // Send that object to the socket
      socket.emit('mouse', instruction);
      //state = 0;
  }
}

function getColor(i) {
  var colors = [
    color(255, 102, 102), 
    color(102, 178, 255), 
    color(102, 255, 178), 
    color(255, 253, 104), 
    color(255, 204, 153), 
    color(155, 155, 255),
  ];
  return colors[i % colors.length];
}

