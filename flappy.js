// Having n mind that i'm going to need to create several elements
// is better to have a function to do so

function newElement (tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem //it will return document.createElement(tagName).className
}