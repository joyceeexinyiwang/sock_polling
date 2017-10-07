
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
