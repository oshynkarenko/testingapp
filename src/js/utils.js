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