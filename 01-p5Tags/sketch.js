const strings = [
  "anatroccolo",
  "balena",
  "cane",
  "drago"
]

class Tag{
  constructor(_string){
    //this.string=_string
  }
  show(){
    
  }

}

function setup() {
  createCanvas(600,600);

  textAlign(CENTER,CENTER)
  textSize(20)


}

function draw() {
  background(125)

  push();
  fill(255);
  noStroke();

  translate(width/2,height/2)
  circle(0,0,textWidth(strings[0]));

  fill(0)

  text(strings[0],0,0)

  pop();
}
