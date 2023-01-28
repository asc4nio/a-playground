var renderer = {
  inputImg: null,
  inputSrc: 'asset/inputTest.jpg',
  density: "0987654321",
  itemSize: 'responsive',
  cornerRadius: 0,
  cornerRadiusMax: 12,
  cornerAnim: function () {
    const cornerAnimTl = gsap.timeline({ repeat: -1 })
    cornerAnimTl.fromTo(renderer, { cornerRadius: 0 }, { cornerRadius: renderer.cornerRadiusMax, duration: 1, ease: 'none' }, '0')
    cornerAnimTl.fromTo(renderer, { cornerRadius: renderer.cornerRadiusMax }, { cornerRadius: 0, duration: 1, ease: 'none' }, '>')
  }
}


function preload() {
  renderer.inputImg = loadImage(renderer.inputSrc)
}


function setup() {
  createCanvas(innerWidth, innerHeight);

  renderer.cornerAnim()
}


function draw() {
  background(0)
  
  renderer.inputImg.loadPixels();

  if(renderer.itemSize === 'responsive'){
    var w = width / renderer.inputImg.width;
    var h = height / renderer.inputImg.height;
  } else {
    var w = renderer.itemSize
    var h = renderer.itemSize
  }

  for (let i = 0; i < renderer.inputImg.width; i++) {
    for (let j = 0; j < renderer.inputImg.height; j++) {
      const pixelIndex = (i + j * renderer.inputImg.width) * 4;
      const r = renderer.inputImg.pixels[pixelIndex + 0];
      const g = renderer.inputImg.pixels[pixelIndex + 1];
      const b = renderer.inputImg.pixels[pixelIndex + 2];
      const avg = (r + g + b) / 3;

      noStroke();
      fill(avg);
      rect(i * w, j * h, w, h, renderer.cornerRadius, renderer.cornerRadius, renderer.cornerRadius, renderer.cornerRadius)

      // const len = renderer.density.length;
      // const charIndex = floor(map(avg,0,255,len,0));

      // textSize(w);
      // textAlign(CENTER, CENTER);
      // text(renderer.density.charAt(charIndex), i * w + w * 0.5, j * h + h * 0.5);

    }
  }
}



function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}