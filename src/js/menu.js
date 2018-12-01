export default class Menu {
    constructor(){
        this.openButton = document.getElementById('menu-burger');
        this.menu = document.getElementById('header-menu');
        this.container = document.getElementById('header-top');
        this.container.addEventListener('click', this.render.bind(this));
    }

    render(event) {
        if (event.target === this.openButton || event.target.classList.contains('menu__buttons')) {
            if (this.menu.classList.contains('header__menu--mobile')) {
                this.menu.classList.remove('header__menu--mobile');
            } else {
                this.menu.classList.add('header__menu--mobile');
            }
        } else {
            this.menu.classList.remove('header__menu--mobile');
        }
    }
}