function setup() {
  createCanvas(innerWidth, innerHeight);
}

function draw() {
  push();
  fill(255);
  noStroke();
  circle(50,50,50);
  pop();
}


function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}