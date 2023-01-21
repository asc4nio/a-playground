let stars = [];
let source = [];

let starScale;
const quantityMult = 1;

function preload() {
  source[0] = loadImage(
    "images/wotcha-desktop.png"
  );
  source[1] = loadImage(
    "images/me-desktop.png"
  );
  source[2] = loadImage(
    "images/aequitas-desktop.png"
  );
  source[3] = loadImage(
    "images/tdh-desktop.png"
  );
  source[4] = loadImage(
    "images/cadiai-mobile.png"
  );
  source[5] = loadImage(
    "images/tdh-mobile.png"
  );
  // source[6] = loadImage(
  //   "images/webclip.png"
  // );
  // source[7] = loadImage(
  //   "images/favicon-white.png"
  // );
}

function setStarScale() {
  let sizeToConsider;
  if (windowWidth <= windowHeight) {
    sizeToConsider = windowWidth;
  } else {
    sizeToConsider = windowHeight;
  }
  starScale = map(sizeToConsider, 0, 4000, 0, 2.5);
}

function setup() {
  // rectMode(CENTER);
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < source.length * quantityMult; i++) {
    stars.push(new Star());
  }
  setStarScale();
  // console.log(windowWidth, windowHeight, starScale);
}

function draw() {
  clear();
  smooth();

  translate(width / 2, height / 2);



  let transMouseX = mouseX - innerWidth/2
  let transMouseY = mouseY - innerHeight/2

  push()
  fill(0,0,255)
  circle(transMouseX, transMouseY, 10)
  pop()

  for(let star of stars){
    star.show()
    star.update()




    if(transMouseX > star.bbp1.x &&
      transMouseX < star.bbp2.x &&
      transMouseY > star.bbp1.y &&
      transMouseY < star.bbp2.y
      ){
console.log('intersection')
    } else {
      // console.log('no intersection')
    }

    // console.log(star)
  }
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.scale = random(0,0.5);
    this.increment = random(0.0005, 0.002);
    this.index = floor(random(source.length));

    this.bbp1 = createVector()
    this.bbp2 = createVector()

  }
  show() {
    noStroke();

    push();
    
    scale(this.scale);

    image(
      source[this.index],
      this.x,
      this.y,
      source[this.index].width * starScale,
      source[this.index].height * starScale
    );

    if (this.scale < 0.15) {
      this.alpha = map(this.scale, 0, 0.15, 255, 0);
      fill(255, this.alpha);
      rect(
        this.x,
        this.y,
        source[this.index].width * starScale,
        source[this.index].height * starScale
      );
    } else if (this.scale >= 0.98) {
      this.alpha = map(this.scale, 0.98, 1, 0, 255);
      fill(0, this.alpha);
      rect(
        this.x,
        this.y,
        source[this.index].width * starScale,
        source[this.index].height * starScale
      );
    }
    pop();
  }
  update() {
    this.scale += this.increment;

    if (this.scale > 1) {
      this.index = floor(random(source.length));
      this.scale = 0;
      this.x = random(-width, width);
      this.y = random(-height, height);
    }

    this.bbp1.x = this.x
    this.bbp1.y = this.y

    this.bbp2.x = this.x + (source[this.index].width * starScale)
    this.bbp2.y = this.y + (source[this.index].height * starScale)

    this.bbp1.mult(this.scale)
    this.bbp2.mult(this.scale)

    push()
    fill(0,255,0)

    circle(this.bbp1.x,this.bbp1.y,10)
    circle(this.bbp2.x,this.bbp2.y,10)

    pop()

  }


}
