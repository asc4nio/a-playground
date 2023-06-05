const content = [
    'anatra',
    'balenottero',
    'cane',
    'dromedario',
    'elefante',
    'farfalla',
    'gatto',
    'hippo'
]

var config = {
    textSize: 60,
    textScale : 0.66,
    tagPadding : 5,
    tagsPerRow : 20,
    rowsQuantity :11,
    tagsEmptyChance : 0.2
}

var rows = []

let handImg
let pointerV, centerV, relativeV


function preload() {
    handImg = loadImage('hand.png')
}

function setup() {
    createCanvas(400, 600);

    for (let i = 0; i < config.rowsQuantity; i++) {
        let newRowYPos = config.textSize * i
        rows[i] = new Row(newRowYPos)
    }

    centerV = createVector(width / 2, height / 2);

}

function draw() {
    background(125)

    for (let i = 0; i < rows.length; i++) {
        rows[i].update()
    }

    pointerV = createVector(mouseX, mouseY);
    relativeV = pointerV.sub(centerV)
  
    let rotFromRelV = relativeV.heading()-PI*0.5

    push()
    translate(width/2, height/2)
    rotate(rotFromRelV) 
    translate(0, relativeV.mag())

    translate(-90,-10)
    image(handImg, 0, 0, handImg.width*0.5, handImg.height*0.5)


    pop()


}

class Row {
    constructor(_yPos) {
        this.tags = []
        this.rowWidth = 0
        this.yPos = _yPos
        this.speed = random(0.5,2)

        for (let i = 0; i < config.tagsPerRow; i++) {
            this.tags[i] = new Tag()
            if (i==0) {
                this.tags[i].place(0,this.yPos)
            } else {
                this.prevTagXPos = this.tags[i-1].position.x
                this.prevTagWidth = this.tags[i-1].width
                this.nextTagWidth = this.tags[i].width
    
                this.nexTagXPos = this.prevTagXPos + (this.prevTagWidth + this.nextTagWidth)/2
    
                this.tags[i].place(this.nexTagXPos ,this.yPos)
            }
    
            this.rowWidth += this.tags[i].width
        }
    }
    update(){
        for (let i = 0; i < config.tagsPerRow; i++) {
            this.tags[i].move(this.speed)
            this.tags[i].watch(this.rowWidth)
            this.tags[i].show()
        }
    }
}

class Tag {
    constructor() {
        textAlign(CENTER, CENTER)
        textSize(config.textSize*config.textScale)
        rectMode(CENTER)
        noStroke()

        this.position = createVector()

        this.contentIndex = floor(random(content.length))
        this.string = content[this.contentIndex]

        this.width = floor(textWidth(this.string) + config.textSize)
        this.height = config.textSize

        this.isEmpty = random(1)>config.tagsEmptyChance
        this.isHover = false

        this.palette = {
            base : color(255),
            text : color(0),
            hover : color(255,255,0),
            click : color(0,255,0),
        }

        // this.isClicked = false

    }
    place(_x,_y){
        this.position.x = _x
        this.position.y = _y
    }
    move(_speed){
        this.position.x -= _speed
    }
    watch(_width){
        if (this.position.x < this.width/-2) {
            this.position.x += _width
        }
        if(mouseX > this.position.x - this.width/2 &&
        mouseX < this.position.x + this.width/2 &&
        mouseY > this.position.y - this.height/2 &&
        mouseY < this.position.y + this.height/2
        ){
            this.isHover = true

            if (mouseIsPressed === true) {
                console.log(this, 'clicked')
            }


        } else {
            this.isHover = false
        }
    }
    show() {
        push()
            translate(this.position.x,this.position.y)
            if(! this.isHover){
                fill(this.palette.base)
            } else {
                fill(this.palette.hover)
            }
            rect(0,0, this.width - config.tagPadding, this.height - config.tagPadding, 50)
            if(!this.isEmpty){
                fill(this.palette.text)
                text(this.string, 0,0)
            }

        pop()
    }

}