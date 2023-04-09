const content = [
    'albero',
    'bordo',
    'cuculo',
    'dromedario'
]

var config = {
    textSize: 40,
    textScale : 0.66,
    tagPadding : 5,
    tagsPerRow : 8,
    rowsQuantity : 11
}

var rows = []

function setup() {
    createCanvas(400, 400);

    for (let i = 0; i < config.rowsQuantity; i++) {
        let newRowYPos = config.textSize * i
        rows[i] = new Row(newRowYPos)
    }

}

function draw() {
    background(125)

    for (let i = 0; i < rows.length; i++) {
        rows[i].update()
    }

}

class Row {
    constructor(_yPos) {
        this.tags = []
        this.rowWidth = 0
        this.yPos = _yPos

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
            this.tags[i].show()
            this.tags[i].move(this.rowWidth)
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

    }
    place(_x,_y){
        this.position.x = _x
        this.position.y = _y
    }
    move(_width){
        this.position.x --

        if (this.position.x < this.width/-2) {
            this.position.x += _width
        }
    }
    show() {
        push()
            translate(this.position.x,this.position.y)
            fill(255)
            rect(0,0, this.width - config.tagPadding, this.height - config.tagPadding, 50)
            fill(0)
            text(this.string, 0,0)
        pop()
    }

}