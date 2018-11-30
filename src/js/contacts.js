import {content} from './main.js';

export default class Contacts {
    constructor() {
        this.openLink = document.getElementById('contacts_link');
        this.openLink.addEventListener('click', this.render.bind(this));
    }
    render(event) {
        content.innerHTML = document.getElementById('contacts').textContent.trim();
    }
}