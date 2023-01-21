let stars = [];
let source = [];

let normMouse

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
  createCanvas(windowWidth, windowHeight);

  normMouse = createVector()
  
  for (let i = 0; i < source.length * quantityMult; i++) {
    stars.push(new Star());
  }
  setStarScale();
}

function draw() {
  clear();
  smooth();

  translate(width / 2, height / 2);

  normMouse.x = mouseX - innerWidth/2
  normMouse.y = mouseY - innerHeight/2

  for(let star of stars){
    star.show()
    star.update()
    star.mouseIntersects(normMouse)

    //intersectsOther ?
  }
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.scale = random(0,0.5);
    this.increment = random(0.0005, 0.002);
    this.index = floor(random(source.length));

    this.centerPosition = createVector()

    this.bbP1 = createVector()
    this.bbP2 = createVector()

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

    // collision variables
    this.bbP1.x = this.x
    this.bbP1.y = this.y
    this.bbP2.x = this.x + (source[this.index].width * starScale)
    this.bbP2.y = this.y + (source[this.index].height * starScale)
    this.bbP1.mult(this.scale)
    this.bbP2.mult(this.scale)

    this.centerPosition.x = (this.bbP1.x+this.bbP2.x)/2
    this.centerPosition.y = (this.bbP1.y+this.bbP2.y)/2

    // reset cycle
    if (this.scale > 1) {
      this.index = floor(random(source.length));
      this.scale = 0;
      this.x = random(-width, width);
      this.y = random(-height, height);
    }

    // debug BB
    push()
      fill(0,255,0)
      circle(this.bbP1.x,this.bbP1.y,10)
      circle(this.bbP2.x,this.bbP2.y,10)
      fill(255,0,0)
      circle(this.centerPosition.x,this.centerPosition.y,10)
      fill(0,0,255)
      circle(normMouse.x, normMouse.y, 10)
    pop()
  }
  mouseIntersects(_v2Input){

    if(_v2Input.x > this.bbP1.x &&
      _v2Input.x < this.bbP2.x &&
      _v2Input.y > this.bbP1.y &&
      _v2Input.y < this.bbP2.y
      ){
console.log('intersection')
    } else {
      // console.log('no intersection')
    }

  }


}
