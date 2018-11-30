import {createElement, clearContainer} from './utils';
import {content} from "./main";

export default class Timer {
    constructor() {
        this.render();
        this.start();
        content.addEventListener('click', this.stop.bind(this));
        document.querySelector('.header').addEventListener('click', this.hide.bind(this));
    }

    render() {
        this.container = document.querySelector('.timer_block');
        clearContainer(this.container);
        this.container.classList.add('timer_block--active');
        this.timerHeading = createElement('p', 'timer_block__heading', this.container);
        this.timerHeading.textContent = 'Time spent:';
        this.timerId = createElement('p', 'timer_block__timer', this.container);
        this.timerId.textContent = '0';
    }

    start() {
        this.reset();
        this.startTime = new Date().getTime();
        this.id = setInterval(() => {
            this.currentTime = new Date().getTime();
            let time = this.currentTime - this.startTime;
            this.update(time)
        }, 4);
    };

    stop(event) {
        if (event.target === document.querySelector('.test__end_button')) {
            clearInterval(this.id);
        }
    }

    hide(event) {
        debugger;
        if (event.target.parentNode.parentNode !== this.openLink) {
            this.container.classList.remove('timer_block--active');
        }
    }


    update(time) {
        this.timerId.textContent = this.getFormattedTime(time);
    }

    getFormattedTime(time) {
        const date = new Date(time);
        const mt = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        const sc = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        const ms = date.getMilliseconds() < 10 ? "00" + date.getMilliseconds() : date.getMilliseconds() < 100 ? "0" + date.getMilliseconds() : date.getMilliseconds();
        return `${mt}:${sc}:${ms}`;
    }

    reset() {
        this.update(0);
    }
}