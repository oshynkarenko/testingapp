import Gallery from './gallery';

export default class Tour {
    constructor() {
         this.container = document.getElementById('content');
         this.openLink = document.getElementById('menu-tour');
         window.addEventListener('load', this.render.bind(this));
         this.openLink.addEventListener('click', this.render.bind(this));
         document.getElementById('logo').addEventListener('click', this.render.bind(this));
    }

    render() {
        event.preventDefault();
        this.container.innerHTML = document.getElementById('tour').textContent.trim();
        this.gallery = new Gallery();
    }
}