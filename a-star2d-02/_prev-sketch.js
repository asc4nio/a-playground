let stars = [];
let source = [];

let starScale;
const quantityMult = 2;

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
    "images/webclip.png"
  );
  source[5] = loadImage(
    "images/favicon-white.png"
  );
  source[6] = loadImage(
    "images/cadiai-mobile.png"
  );
  source[7] = loadImage(
    "images/tdh-mobile.png"
  );
}

/*
function preload() {
  source[0] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b35744d4ce1f5b22c618e4_wotcha-desktop.png"
  );
  source[1] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b357447f5b40c1a762e31b_me-desktop.png"
  );
  source[2] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b35743ca4a1d370665de36_aequitas-desktop.png"
  );
  source[3] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b35e97d96ad40c6948e34d_tdh-desktop.png"
  );
  source[4] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b1e0452b9e4d3961584fcb_webclip.png"
  );
  source[5] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b1e0559ea3b500decebffc_favicon-white.png"
  );
  source[6] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b355c6ff784167181ca2f5_cadiai-mobile.png"
  );
  source[7] = loadImage(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/62b35e97090dd601d8f8bc9b_tdh-mobile.png"
  );
}
*/
function setStarScale() {
  let sizeToConsider;
  if (windowWidth <= windowHeight) {
    sizeToConsider = windowWidth;
  } else {
    sizeToConsider = windowHeight;
  }

  starScale = map(sizeToConsider, 0, 4000, 0, 2.5);

  // 2000 =1, 1000 = 0.5
}

function setup() {
  //rectMode(CENTER)

  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  
  for (let i = 0; i < source.length * quantityMult; i++) {
    stars.push(new Star());
  }
  setStarScale();
  console.log(windowWidth, windowHeight, starScale);
}

function draw() {
  // console.log(frameRate());
  clear();
  smooth();
  //background(0);
  //speed = map(mouseX, 0, width, 0,15);

  translate(width / 2, height / 2);

  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
}

class Star {
  constructor() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.scale = random(1);
    this.increment = random(0.0005, 0.002);
    this.index = floor(random(source.length));
  }

  update() {
    this.scale += this.increment;

    if (this.scale > 1) {
      this.index = floor(random(source.length));
      this.scale = 0;
      this.x = random(-width, width);
      this.y = random(-height, height);
    }
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
    } else {
    }

    pop();
  }
}
