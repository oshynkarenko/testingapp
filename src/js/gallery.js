import {createElement} from "./utils";

export default class Gallery {
    constructor() {
        this.container = document.getElementById('gallery');
        this.container.addEventListener('click', this.showPicture.bind(this));
    }

    showPicture () {
        if (event.target.classList.contains('gallery__image')) {
            let format;
            if( event.target.classList.contains('gallery__image--landscape')) {
                format = 'landscape';
            } else {
                format = 'portrait';
            }
            let markUp = `
                        <button class="gallery__enlarge__button" id="gallery__close_btn">X</button>
                        <img class="gallery__enlarge__image" src=${event.target.src} alt=${event.target.alt}>
                        `;
            let frame = createElement('div', `gallery__enlarge--${format}`, this.container);
            frame.innerHTML = markUp;
            this.enlarged = document.querySelector(`.gallery__enlarge--${format}`);
            this.closeButton = document.getElementById('gallery__close_btn');
            this.closeButton.addEventListener('click', this.hidePicture.bind(this));
        }
    }

    hidePicture() {
        if (this.enlarged !== null) {
            this.container.removeChild(this.enlarged);
        }
    }
}