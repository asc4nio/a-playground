let l1, l2

let nLayer = []
let nImage
let cols, rows, scl, inc
let xoff, yoff, zoff;


function setup() {
  createCanvas(800,800);
  pixelDensity(1)
  //background(0,255,0)
  noiseDetail(4,0.5)
  //noSmooth()

  l1 = createGraphics(width,height);
  l2 = createGraphics(width,height);

  scl = 20;
  inc = 0.2;
  cols = floor(width / scl);
  rows = floor(height / scl);

  zoff=0

  nImage= createImage(scl,scl)
  nImage.loadPixels()

  //noLoop()

}

function draw() {
  l1.clear()
  l2.clear()

  background(120)

  let yoff = 0;

  for(let y=0; y<rows; y++){
    let xoff = 0;
    for(let x=0; x<cols; x++){
      let index = (x + y * cols);
      let nValue = noise(xoff, yoff, zoff)
      let nColor = floor(nValue*255)

      nLayer[index]=nValue
      nImage.set(x,y,color(nColor))
      xoff += inc;

      let xPos= x*cols
      let yPos= y*rows

      l1.textSize(16)
      l1.text(floor(nValue*10), x*cols, y*rows)


      /*
      let l3 = createGraphics(width/cols,height/rows)
      l3.line(-rows/2,-cols/2,rows/2,cols/2)
      image(l3,xPos,yPos,l3.width,l3.height)
      */
      
      l2.noStroke()
      l2.translate(xPos,yPos)
      l2.circle(0,0,nValue*50)
5      //l2.line(-rows/2,-cols/2,rows/2,cols/2)
      l2.translate(-xPos,-yPos)
      

    }

    yoff += inc*2;
    zoff += 0.0001;
  }
  nImage.updatePixels()

  //image(nImage,0,0,width,height)
  image(l2,0,0,width,height)
  //image(l1,0,0,width,height)
}
