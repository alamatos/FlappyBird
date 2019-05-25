// Having in mind that i'm going to need to create several elements
// is better to have a function to do so

function newElement (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem //it will return document.createElement(tagName).className
}
// constructor function
function Barrier (reverse = false) {
    this.element = newElement('div','barrier')

    const top = newElement('div', 'top')
    const body = newElement('div','body')

    this.element.appendChild(reverse ? body : top)
    this.element.appendChild(reverse ? top : body)

    this.setHeight = function (heigthGiven) { 
        body.style.height= `${heigthGiven}px`
    }
    
}

// const b = new Barrier(false)
// b.setHeight(200)
// document.getElementById('flappy').appendChild(b.element)

function Barriers (heigthGiven, spaceBetween, xPositioning) {
    this.element = newElement('div', 'barriers')

    this.upper = new Barrier(true)
    this.lower = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.defineSpaceBetween = () => {
        const upperHeight = Math.random()*(heigthGiven-spaceBetween)
        const lowerHeight = heigthGiven-spaceBetween-upperHeight

        this.upper.setHeight(upperHeight)
        this.lower.setHeight(lowerHeight)
    }

    this.getXPositioning = () => {
        parseInt(this.element.style.left.split('px')[0])
    }
    this.setXPositioning = xPositioning => {
        this.element.style.left= `${xPositioning}px`
    }
    this.getWidth = () => this.element.clientWidth
    this.defineSpaceBetween()
    this.setXPositioning(xPositioning)
}

// const b = new Barriers (700,200,400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function AllBarriers (heigthGiven, width, spaceBetween, space, pointNotification) {
    this.pairs = [
        new Barriers(heigthGiven, spaceBetween, width),
        new Barriers(heigthGiven, spaceBetween, width + space),
        new Barriers(heigthGiven, spaceBetween, width + space * 2),
        new Barriers(heigthGiven, spaceBetween, width + space * 3),
    ]

    const movement = 3

    this.animate = () => {
        this.pairs.forEach(pair => {
            pair.setXPositioning(pair.getXPositioning()-movement)

            if(pair.getXPositioning() < -pair.getWidth()) {
                pair.setXPositioning(pair.getXPositioning() + space * this.pairs.length)
                pair.defineSpaceBetween()
                
            }
            const middle = width/2
            const middleCrossed = pair.getXPositioning() + movement >= middle
            && pair.getXPositioning() < middle
            
            middleCrossed && pointNotification()
            
        })

    }
}
const b = new AllBarriers(700, 1100, 200, 400)

const gameArea = document.getElementById('flappy')
b.pairs.forEach(pair => gameArea.appendChild(pair.element))

setInterval(() => {
    AllBarriers.animate()
},20)