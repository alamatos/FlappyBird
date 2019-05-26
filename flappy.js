// Having in mind that i'm going to need to create several elements
// is better to have a function to do so

function newElement (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem 
}
// constructor function
function Barrier (reverse = false) {
    this.element = newElement('div','barrier')

    const top = newElement('div', 'top') //define new element top
    const body = newElement('div','body') //define new element body

    //if it is a reversed barrier 1st it comes the body and after it will be the body
    //if it is a normal barrier firstly i apply the body

    this.element.appendChild(reverse ? body : top) 
    this.element.appendChild(reverse ? top : body)

    this.setHeight = function (heigthGiven) { 
        body.style.height= `${heigthGiven}px`
    }
    
}

//Create the barriers wit a consturctor function
// That's going to receive all the information needed
function Barriers (heigthGiven, spaceBetween, xPositioning) {
    //new element is a div with a class barriers
    this.element = newElement('div', 'barriers')

    //the upper barrier is a reverse barrier (body and top)
    this.upper = new Barrier(true)
    //the lower barrier is a reverse barrier (top and body)
    this.lower = new Barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    //the space between barriers will be a fixed value,
    //i'll define only one side, and the other side will adapt
    this.defineSpaceBetween = () => {
        //o math.random is from 0 to 1, with this i'll be able to have a variable upper height
        const upperHeight = Math.random()*(heigthGiven-spaceBetween)
        const lowerHeight = heigthGiven-spaceBetween-upperHeight

        this.upper.setHeight(upperHeight)
        this.lower.setHeight(lowerHeight)
    }

    //Position of the barriers in x
    this.getXPositioning = () => {
       return parseInt(this.element.style.left.split('px')[0])
    }
    this.setXPositioning = xPositioning => {
        return this.element.style.left= `${xPositioning}px`
    }
    this.getWidth = () => this.element.clientWidth
    this.defineSpaceBetween()
    this.setXPositioning(xPositioning)
}



function AllBarriers (heigthGiven, width, spaceBetween, space, pointNotification) {
    //definition of the barriers in the beggining of the game
    this.pairs = [
        new Barriers(heigthGiven, spaceBetween, width),
        new Barriers(heigthGiven, spaceBetween, width + space),
        new Barriers(heigthGiven, spaceBetween, width + space * 2),
        new Barriers(heigthGiven, spaceBetween, width + space * 3),
    ]

    const movement1 = 3

    this.animate = () => {
        
        this.pairs.forEach(pair => {
            pair.setXPositioning(pair.getXPositioning() - movement1)

            //when the element exits the game area
            if(pair.getXPositioning() < -pair.getWidth()) {
                pair.setXPositioning(pair.getXPositioning() + space * this.pairs.length)
                pair.defineSpaceBetween()
                
            }
            const middle = width/2
            const middleCrossed = pair.getXPositioning() + movement1 >= middle
            && pair.getXPositioning() < middle
            
            // if the barrier crosses the middle of the game area it will notify a point
            middleCrossed && pointNotification()
            
        })

    }
}

function Bird (heightGame) {
    let fly = false
    this.element = newElement('img', 'bird')
    this.element.src = 'imgs/bird.png'

    //i need to know the height od the bird, in order to define it
    this.getY = () => parseInt(this.element.style.bottom.split('px')[0])
    //define the height of the bird
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => fly = true
    window.onkeyup = e => fly = false

    this.animate = () => {
        //for each key press it will fly 8px upper, if not pressed it will fall 5px
        const newY = this.getY() + (fly ? 8 : -5)      
        const highHeight = heightGame - this.element.clientHeight

        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= highHeight) {
            this.setY(highHeight)
        } else {
            this.setY(newY)
        }
    }
    this.setY(heightGame/2)


}

function Progress () {
    this.element = newElement('span','progress')
    this.updatePoints = points => {
        this.element.innerHTML = points
    }
    this.updatePoints(0)
}

function areOverlapping(elementA, elementB) {
    //rectangle associated to the element A
    const a = elementA.getBoundingClientRect()
    //rectangle associated to the element B 
    const b = elementB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left
    && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top 
    && b.top + b.height >= a.top

    return horizontal && vertical
}

function collision (bird, barriers) {
    let collision = false
    barriers.pairs.forEach(AllBarriers => {
        if(!collision) {
            //define the upper and lower of each barrier
            const superior = AllBarriers.upper.element
            const inferior = AllBarriers.lower.element

            collision = areOverlapping(bird.element, superior)
            || ( areOverlapping(bird.element, inferior))
        }
    })
    return collision
}
//the next function it the main function
function FlappyBird () {
    let points = 0
    const gameArea = document.getElementById('flappy')
    //get the height of the game
    const height = gameArea.clientHeight
    //get the width of the game
    const width = gameArea.clientWidth
    const progress = new Progress()
    const barriers = new AllBarriers(height, width, 200, 400,
        //function taht will notify a point, when the barrier crosses the middle
        
        () => progress.updatePoints(++points))


    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriers.pairs.forEach(pair => gameArea.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval( () => {
            barriers.animate()
            bird.animate()
            if (collision(bird, barriers)) {
                clearInterval(timer)
            }
        },20)
    }
}
new FlappyBird().start()