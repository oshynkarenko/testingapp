export default class Menu {
    constructor(){
        this.openLink = document.getElementById('menu-burger');
        this.container = document.getElementById('header-menu');
        if (this.openLink) {
            this.openLink.addEventListener('click', this.render.bind(this));
        }
    }

    render() {
        this.container.classList.add('header__menu--mobile');
    }
}