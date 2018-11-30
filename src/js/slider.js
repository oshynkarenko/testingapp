export default class Slider {
    constructor() {
        this.container = document.getElementById('slider-block');
        this.leftBtn = document.getElementById('left-arrow');
        this.rightBtn = document.getElementById('right-arrow');
        this.hideButtons = document.getElementById('header-menu');
        this.slides = Array.from(document.getElementsByClassName('header__slider'));
        this.buttonsBlock = document.getElementById('slider__buttons');
        this.slideButtons = Array.from(document.getElementsByClassName('slider__button'));
        this.leftBtn.addEventListener('click', this.moveLeft.bind(this));
        this.rightBtn.addEventListener('click', this.moveRight.bind(this));
        this.buttonsBlock.addEventListener('click', this.showSlide.bind(this));
        document.getElementById('logo').addEventListener('click', this.showSlider.bind(this));
        this.hideButtons.addEventListener('click', this.hideSlider.bind(this));
        this.autoSlider = setInterval(this.moveRight.bind(this), 4000);
    }

    moveLeft() {
        let currentSlideNum = this.slides.findIndex((slide) => slide.classList.contains('header__slider--active'));
        if (currentSlideNum > 0) {
            this.slides[currentSlideNum].classList.add('header__slider--right');
            this.slides[currentSlideNum].classList.remove('header__slider--active');
            this.slides[currentSlideNum - 1].classList.add('header__slider--active');
            this.slideButtons[currentSlideNum].classList.remove('slider__button--active');
            this.slideButtons[currentSlideNum - 1].classList.add('slider__button--active');
        } else {
            this.slides[currentSlideNum].classList.remove('header__slider--active');
            this.slides[this.slides.length - 1].classList.add('header__slider--active');
            this.slideButtons[currentSlideNum].classList.remove('slider__button--active');
            this.slideButtons[this.slideButtons.length - 1].classList.add('slider__button--active');
        }
    }

    moveRight() {
        let currentSlideNum = this.slides.findIndex((slide) => slide.classList.contains('header__slider--active'));
        if (currentSlideNum < this.slides.length - 1) {
            this.slides[currentSlideNum].classList.remove('header__slider--active');
            this.slides[currentSlideNum + 1].classList.add('header__slider--active');
            this.slideButtons[currentSlideNum].classList.remove('slider__button--active');
            this.slideButtons[currentSlideNum + 1].classList.add('slider__button--active');

        } else {
            this.slides[currentSlideNum].classList.remove('header__slider--active');
            this.slides[0].classList.add('header__slider--active');
            this.slideButtons[currentSlideNum].classList.remove('slider__button--active');
            this.slideButtons[0].classList.add('slider__button--active');
        }
    }

    showSlide(event) {
        this.slideButtons.forEach((button) => button.classList.remove('slider__button--active'));
        this.slides.forEach((slide) => slide.classList.remove('header__slider--active'));
        let currentButton = this.slideButtons.findIndex((button) => button === event.target);
        this.slideButtons[currentButton].classList.add('slider__button--active');
        this.slides[currentButton].classList.add('header__slider--active');

    }

    showSlider() {
        this.container.classList.remove('header__slider_block--hidden');
        this.autoSlider = setInterval(this.moveRight.bind(this), 4000);
    }

    hideSlider(event) {
        this.container.classList.add('header__slider_block--hidden');
            clearInterval(this.autoSlider);
    }
}