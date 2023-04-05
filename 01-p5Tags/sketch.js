const strings = [
  "anatroccolo",
  "balena",
  "cane",
  "drago",
  "elefante",
  "furetto"
]

const tSize = 40
const tQuant = 10

const rows = []
const rQuant = 10

function setup() {
  createCanvas(400, 400);
  // background(125)

  for (let i = 0; i < rQuant; i++) {
    rows[i] = new Row()
    rows[i].init()
  }

  console.log(rows)

}

function draw() {
  background(125)

  for (let i = 0; i < rQuant; i++) {
    rows[i].show(tSize*i)
    rows[i].move()
  }

}


class Row {
  constructor() {
    this.tags = []
    this.xOffset = 0
    this.direction = null
  }
  init() {
    for (let i = 0; i < tQuant; i++) {
      this.tags[i] = new Tag
      this.tags[i].init()
    }
    if(random(1)>0.5){
      this.direction = true
    } else {
      this.direction = false
    }
  }
  move() {
    if(this.direction){
      this.xOffset += 1
        } else {
      this.xOffset -= 1
    }
  }
  show(_y) {
    push()
    translate(0,_y)

    for (let i = 0; i < tQuant; i++) {
      let prevSize = 0
      if (i > 0) {
        prevSize = this.tags[i - 1].bWidth / 2 + this.tags[i].bWidth / 2
      }
      this.tags[i].move(this.xOffset)
      this.tags[i].show(prevSize)

    }
    pop()
  }

}


class Tag {
  constructor() {
    this.state = null
    this.bWidth = null

    this.xIncrement = 0

    textAlign(CENTER, CENTER)
    textSize(tSize*0.66)
    rectMode(CENTER)
    noStroke()
  }
  init() {
    this.sIndex = floor(random(strings.length))
    this.string = strings[this.sIndex]

    if(random(1)>0.5){
      this.state = 'text'
    } else {
      this.state = 'empty'
    }

    this.tWidth = textWidth(this.string)
    this.tHeight = tSize
    this.bWidth = this.tWidth + tSize
  }
  move(_x) {
    this.xIncrement = _x
    if(this.xIncrement > width  ){
      this.init()
    }
  }
  show(_x) {
    translate(_x , 0)
    fill(255)
    rect(this.xIncrement, 0, this.bWidth, this.tHeight, 50)
    if(this.state === 'text'){
      fill(0)
      text(strings[this.sIndex], this.xIncrement, 0)
    }

  }

}

