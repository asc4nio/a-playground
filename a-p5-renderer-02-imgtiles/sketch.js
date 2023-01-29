var renderer = {
  inputImg: null,
  inputSrc: 'https://pbs.twimg.com/media/DZy6bkPVwAAhyMJ.jpg',
  density: "0987654321",
  itemSize: 20,
}

let outputs = []


function preload() {
  renderer.inputImg = loadImage(renderer.inputSrc)
  // outputs[0] = loadImage('asset/tile-01.jpg')
  // outputs[1] = loadImage('asset/tile-02.jpg')
  // outputs[2] = loadImage('asset/tile-03.jpg')

  // outputs[3] = loadImage('asset/dot_01.jpg')
  // outputs[4] = loadImage('asset/dot_02.jpg')
  // outputs[5] = loadImage('asset/dot_03.jpg')

  
  outputs[0] = loadImage('asset/dot_01.jpg')
  outputs[1] = loadImage('asset/tile-01.jpg')
  outputs[2] = loadImage('asset/dot_02.jpg')
  outputs[3] = loadImage('asset/tile-02.jpg')
  outputs[4] = loadImage('asset/dot_03.jpg')
  outputs[5] = loadImage('asset/tile-03.jpg')

}


function setup() {
  createCanvas(innerWidth, innerHeight);
  noSmooth();

  renderer.inputImg.resize(64,64)

  // renderer.cornerAnim()
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

      // const len = renderer.density.length;
      // const charIndex = floor(map(avg,0,255,len,0));

      // textSize(w);
      // textAlign(CENTER, CENTER);
      // text(renderer.density.charAt(charIndex), i * w + w * 0.5, j * h + h * 0.5);

      const len = outputs.length;
      const outputsIndex = floor(map(avg,0,255,0,len));
      image(outputs[outputsIndex], i * w , j * h, w,h)

    }
  }
}



function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}