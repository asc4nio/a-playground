let segni = [];
let magnete;
let fillColor, strokeColor;

const canvasBorder = 40;
const circleRadius = 8;
const circleBorderStroke = 2;

let lifeCounter = 0;
let lifeStop = 60000;

function setup() {
  createCanvas(innerWidth, innerHeight);
  //background(126);
  clear();

  magnete = createVector(floor(random(0, width)), floor(random(0, height)));

  fillColor = color(126);
  strokeColor = color(20);

  console.log("first random position", magnete.x, magnete.y);

  for (let i = 0; i < 1; i++) {
    segni[i] = new Segno();
  }

  setInterval(function () {
    // magnete = createVector(floor(random(0,width)),floor(random(0,height))); // noborder

    magnete = createVector(
      floor(random(canvasBorder, width - canvasBorder)),
      floor(random(canvasBorder, height - canvasBorder))
    );
    strokeColor = color(
      floor(random(0, 255)),
      floor(random(0, 255)),
      floor(random(0, 255))
    );
  }, 600);
}

function draw() {
  push();
  fill(255);
  noStroke();
  circle(magnete.x, magnete.y, 4);
  pop();

  for (let i = 0; i < segni.length; i++) {
    segni[i].show();
    segni[i].update();
    //segni[i].applyForce(noiseForce);
  }

  lifeCounter++;
}

class Segno {
  constructor() {
    this.location = createVector(
      floor(random(0, width)),
      floor(random(0, height))
    );
    this.velocity = createVector();
    this.accelleration = createVector(); 
  }
  
  show() {
    push();
    translate(this.location);

    fill(fillColor);
    stroke(strokeColor);
    strokeWeight(1);
    circle(0, 0, circleRadius);
    pop();
  }
  
  update() {
    this.randomAttract();
    // this.mouseAttract()
    
    this.velocity.add(
      this.accelleration
    );

    console.log(
      this.velocity.x,
      this.velocity.y
    );

    this.location.add(
      this.velocity
    );

    //reset before next frame
    this.accelleration.mult(0);
  }
  applyForce(_force) {
    this.accelleration.add(_force);
  }
  randomAttract() {
    this.magnet = createVector(
      magnete.x,
      magnete.y
    );

    // direzione = posizione - mouse => attrazione
    this.attraction = this.magnet.sub(this.location);
    this.attraction.setMag(1);

  this.velocity.add(
    this.attraction
  );
    
    this.velocity.limit(5);
  }
  //    mouseAttract(){
  //     this.mouse = createVector(mouseX,mouseY)
  //     // console.log(this.mouse.x, this.mouse.y)

  //     // direzione = posizione - mouse => attrazione
  //     this.attraction = this.mouse.sub(this.location)
  //     this.attraction.setMag(0.5)

  //     // calcola la potenza e la aggiunge alla somma in update()
  //     this.velocity.add(this.attraction);
  //     this.velocity.limit(2);

  //   }
}
