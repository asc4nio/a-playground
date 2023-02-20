let stars = [];
let textures = [];

let normMouse, starScale

const quantityMult = 2;

const content = [
  {
    string: 'wotcha',
    imageURL: 'images/wotcha-desktop.png'
  },
  {
    string: 'prototype',
    imageURL: 'images/me-desktop.png'
  },
  {
    string: 'aequitas',
    imageURL: 'images/aequitas-desktop.png'
  },
  {
    string: 'our planet',
    imageURL: 'images/tdh-desktop.png'
  },
  {
    string: 'website',
    imageURL: 'images/cadiai-mobile.png'
  },
  {
    string: 'mobile',
    imageURL: 'images/tdh-mobile.png'
  },
]

function preload() {
  for (let i = 0; i < content.length; i++) {
    textures[i] = loadImage(content[i].imageURL)
  }
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
  noStroke();
  smooth();

  normMouse = createVector()

  for (let i = 0; i < content.length * quantityMult; i++) {
    stars.push(new Star());
  }
  setStarScale();
}

function draw() {
  clear();
  translate(width / 2, height / 2);

  normMouse.x = mouseX - innerWidth / 2
  normMouse.y = mouseY - innerHeight / 2

  for (let star of stars) {
    star.update()

    star.show()
    star.mouseIntersects(normMouse)

  }
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.life = random(0, 0.5);
    this.increment = random(0.0005, 0.002);
    this.index = floor(random(content.length));

    this.bbP1 = createVector()
    this.bbP2 = createVector()
    this.centerPoint = createVector()

    this.icon = {
      scale:0
    }

  }
  show() {
    push();
    scale(this.life);
    image(
      textures[this.index],
      this.x,
      this.y,
      textures[this.index].width * starScale,
      textures[this.index].height * starScale
    );

    if (this.life < 0.15) { // light overlay on spawn
      this.alpha = map(this.life, 0, 0.15, 255, 0);
      fill(255, this.alpha);
      rect(
        this.x,
        this.y,
        textures[this.index].width * starScale,
        textures[this.index].height * starScale
      );
    } else if (this.life >= 0.98) { //dark overlay on death
      this.alpha = map(this.life, 0.98, 1, 0, 255);
      fill(0, this.alpha);
      rect(
        this.x,
        this.y,
        textures[this.index].width * starScale,
        textures[this.index].height * starScale
      );
    }
    pop();

    push()  // icon center 01
      scale(this.icon.scale)
      fill(255,255,0)
      circle(this.centerPoint.x, this.centerPoint.y, this.life * 100)
    pop()
  }
  showText() {
    push()
    textSize(32);
    fill(255, 0, 0)
    text(content[this.index].string, this.centerPoint.x, this.centerPoint.y)
    pop()
  }
  calcBB() { // collision points position
    this.bbP1.x = this.x
    this.bbP1.y = this.y
    this.bbP2.x = this.x + (textures[this.index].width * starScale)
    this.bbP2.y = this.y + (textures[this.index].height * starScale)
    this.bbP1.mult(this.life)
    this.bbP2.mult(this.life)

    this.centerPoint.x = (this.bbP1.x + this.bbP2.x) / 2
    this.centerPoint.y = (this.bbP1.y + this.bbP2.y) / 2
  }
  debugBB() { // show BoundingBoxes
    push()
      fill(0, 255, 0) // bbP1 bbP2
      circle(this.bbP1.x, this.bbP1.y, 10)
      circle(this.bbP2.x, this.bbP2.y, 10)
      fill(255, 0, 0) //centerP
      circle(this.centerPoint.x, this.centerPoint.y, 10)
      fill(0, 0, 255) //mouseP
      circle(normMouse.x, normMouse.y, 10)
    pop()
  }
  mouseIntersects(_mouse) {
    let that = this
    if (_mouse.x > this.bbP1.x &&
      _mouse.x < this.bbP2.x &&
      _mouse.y > this.bbP1.y &&
      _mouse.y < this.bbP2.y
    ) {
      this.showText()
      console.log('intersecting', this.index)

      gsap.to(this.icon, {scale: 1, duration: 1 })

      return true
    } else {
      if (this.icon.scale !== 0) {
        gsap.to(this.icon, {scale: 0, duration: 1 })
      }


      return false
    }
  }
  update() {
    this.life += this.increment;

    this.calcBB()
    //this.debugBB()

    if (this.life > 1) { // reset cycle
      this.reset()
    }

  }
  reset() {
    this.index = floor(random(content.length));
    this.life = 0
    this.x = random(-width, width);
    this.y = random(-height, height);
  }
}
