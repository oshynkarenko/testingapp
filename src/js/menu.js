export default class Menu {
    constructor(){
        this.container = document.getElementById('menu-burger');
        document.addEventListener('click', this.render.bind(this));
    }

    render(event) {
        if (event.target.classList.contains('menu__buttons') || event.target === this.container) {
            this.container.classList.add('header__menu--mobile');
        }
    }
}