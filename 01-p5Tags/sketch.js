const strings = [
    "anatroccolo",
    "balena",
    "cane",
    "drago",
    "elefante",
    "furetto"
]

const config = {
    textSize : 40,
    tagsPerRow : 4,
    rowsQuantity : 11
}

var rows = []

var increment = 0


function setup() { 
    createCanvas(400, 400);

    for (let i = 0; i < config.rowsQuantity; i++) {
        rows[i] = new Row()
        rows[i].init()
    }

    // noLoop()
}

function draw() { 
    background(125)

    for (let i = 0; i < rows.length; i++) {
        let nextRowYPos = config.textSize*i
        rows[i].placeTags(nextRowYPos)
        rows[i].show()
        rows[i].watchTag()

    }

    increment --

    if(increment<=width*-1){
        increment=0
    }


}



class Row {
    constructor() {
        this.tags = []
        this.currTagsPositions = []
        this.totalWidth = 0
    }
    init() {
        for (let i = 0; i < config.tagsPerRow; i++) {
            this.tags[i] = new Tag
            this.tags[i].init()
        }
        this.calcTotalWidth()
    }
    placeTags(_y){
        for (let i = 0; i < this.tags.length; i++) {
            this.nextTagPosition = 0
            if (i > 0) {
                this.prevTagPosition = this.tags[i - 1].relPosition.x
                this.nextTagPosition = this.prevTagPosition + (this.tags[i - 1].tagWidth + this.tags[i].tagWidth)/2
            }
            this.tags[i].place(this.nextTagPosition,_y)
            this.tags[i].move()
        }
    }
    show() {
        for (let i = 0; i < this.tags.length; i++) {
            this.tags[i].show()
        }
    }
    calcTotalWidth(){
        for (let i = 0; i < this.tags.length; i++) {
            this.totalWidth += this.tags[i].tagWidth
        }
    }
    watchTag(){
        for (let i = 0; i < this.tags.length; i++) {
            if(this.tags[i].isOutCanvas()){
                this.tags[i].rePlace(this.totalWidth)
            }
        }
    }
  
}

class Tag {
    constructor() {
        this.tagWidth
        this.relPosition = createVector()
        this.absPosition = createVector()

        textAlign(CENTER, CENTER)
        textSize(config.textSize * 0.66)
        rectMode(CENTER)
        noStroke()
    }
    init() {
        this.stringsIndex = floor(random(strings.length))
        this.string = strings[this.stringsIndex]

        this.tagHeight = config.textSize

        this.tagWidth = textWidth(this.string) + config.textSize
    }
    place(_x, _y) {
        this.relPosition.x = _x
        this.relPosition.y = _y
    }
    move(){
        this.absPosition.x = this.relPosition.x
        this.absPosition.x += increment

        this.absPosition.y = this.relPosition.y
    }
    show() {
        fill(255)
        rect(this.absPosition.x, this.absPosition.y, this.tagWidth, this.tagHeight, 50)
        fill(0)
        text(this.string, this.absPosition.x, this.relPosition.y)
    }
    isOutCanvas(){
        if(this.absPosition.x < 0){
            return true
        } else {
            return false
        }
    }
    rePlace(_x){
        this.relPosition.x += _x
        this.move()
        this.show()
    }
  
}