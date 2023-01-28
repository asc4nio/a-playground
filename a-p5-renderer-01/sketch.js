const density = "987654321"
let inputImg

let renderer = {
  cornerRadius: 0,
  cornerRadiusMax : 16
}

let cornerAnim = gsap.timeline({repeat:-1, onUpdate: () => {console.log(renderer.cornerRadius)}})
cornerAnim.to(renderer,{cornerRadius:0, duration:1, ease:'none'},'0')
cornerAnim.to(renderer,{cornerRadius:renderer.cornerRadiusMax, duration:1, ease:'none'},'>')

function preload(){
  inputImg = loadImage('asset/inputTest.jpg')
}

function setup() {
  createCanvas(innerWidth,innerHeight);
}

function draw() {
background(0)
// image(inputImg,0,0,width,height)

let w = width / inputImg.width;
let h = height / inputImg.height;

inputImg.loadPixels();

for (let i = 0; i < inputImg.width; i++) {
  for (let j = 0; j < inputImg.height; j++) {
    const pixelIndex = (i + j * inputImg.width) * 4;
    const r = inputImg.pixels[pixelIndex + 0];
    const g = inputImg.pixels[pixelIndex + 1];
    const b = inputImg.pixels[pixelIndex + 2];
    const avg = (r + g + b) / 3;
    
    noStroke();
    fill(avg);
    // circle(i * w, j * h, w);
    rect(i * w, j * h, w,h, renderer.cornerRadius,renderer.cornerRadius,renderer.cornerRadius,renderer.cornerRadius)
    
    // const len = density.length;
    // const charIndex = floor(map(avg,0,255,len,0));
  
    // textSize(w);
    // textAlign(CENTER, CENTER);
    // text(density.charAt(charIndex), i * w + w * 0.5, j * h + h * 0.5);
    
  }
} 
}

// let w = width / inputImg.width;
// let h = height / inputImg.height

// inputImg.loadPixels()

// for(let y=0; y < inputImg.height; y++ ){

//   for(let x=0; x < inputImg.width; x++ ){

//     const pixelIndex = (x + y * inputImg.width *4)

//     const r =  inputImg.pixels[pixelIndex+0]
//     const g =  inputImg.pixels[pixelIndex+1]
//     const b =  inputImg.pixels[pixelIndex+2]
//     // const a =  inputImg.pixels[pixelIndex+3]

//     // const avg = (r+g+b)/3

//     noStroke()
//     fill(r,g,b)
//     square(x*w, y*h, w)

//     // fill(avg)
//     // text('A',x*w, i*h)
  
//   }

// }

// }





function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}