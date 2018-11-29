export default class Menu {
    constructor(){
        this.container = document.getElementById('header-menu');
        document.addEventListener('click', this.render.bind(this));
    }

    render() {
        if (event.target.classList.contains('header__menu__button')) {
            this.container.classList.add('header__menu--mobile');
        }
    }
}