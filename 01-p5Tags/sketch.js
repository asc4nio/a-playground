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
    tagsPerRow : 3
}

var tags = []

var rowWidth = 0

function setup() {
    createCanvas(400, 400);

    for (let i = 0; i < config.tagsPerRow; i++) {
        tags[i] = new Tag()
        if (i==0) {
            tags[i].place(0,0)
        } else {
            let prevTagXPos = tags[i-1].position.x
            let prevTagWidth = tags[i-1].width
            let nextTagWidth = tags[i].width

            let nexTagXPos = prevTagXPos + (prevTagWidth + nextTagWidth)/2

            // console.log(nexTagXPos)
            tags[i].place(nexTagXPos ,0)
        }

        rowWidth += tags[i].width

        console.log(rowWidth)
    }

}

function draw() {
    background(125)
    translate(0, height/2)

    for (let i = 0; i < config.tagsPerRow; i++) {
        tags[i].show()
        tags[i].move()
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
    move(){
        this.position.x --

        if (this.position.x < this.width/-2) {
            this.position.x += rowWidth
        }
    }
    show() {
        push()
            translate(this.position.x,0)
            fill(255)
            rect(0,0, this.width - config.tagPadding, this.height - config.tagPadding, 50)
            fill(0)
            text(this.string, 0,0)
        pop()
    }

}