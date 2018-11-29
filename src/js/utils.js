export function createElement(tag, classname, container) {
    let newEl = document.createElement(tag);
    container.appendChild(newEl);
    newEl.classList.add(classname);
    return document.querySelector(`.${classname}`);
}

export function clearContainer(container) {
    if (container.innerHTML !== '') {
        container.innerHTML = '';
    }
}

export const counter = (function() {
    let privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }
    return {
        increment: function() {
            changeBy(1);
        },
        decrement: function() {
            changeBy(-1);
        },
        value: function() {
            return privateCounter;
        }
    };
})();