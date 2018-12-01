import {createElement} from "./utils";
import {content, test} from './main';

export default class Pagination {
    constructor(data) {
        this.data = data;
        this.totalPages = Math.ceil(this.data.length / 10);
        this.currentPage = 1;
        this.dataByPage = this.breakDataByPage();
        content.addEventListener('click', this.switchPage.bind(this));
    }

    breakDataByPage() {
        let dataByPage = [];
        for (let i = 0; i < this.totalPages; i++) {
            dataByPage.push(this.data.slice(i * 10, (i + 1) * 10));
        }
        return dataByPage;
    }

    render() {
        this.container = createElement('div', 'pagination', content);
        let markUp = '<div class="pagination__page pagination__page__control--left"><span class="pagination__arrow pagination__arrow--left" id="pagination-left"></span></div>';
        for (let i = 0; i < this.totalPages; i++) {
            markUp += `<div class="pagination__page">${i + 1}</div>`;
        }
        markUp += '<div class="pagination__page pagination__page__control--right"><span class="pagination__arrow pagination__arrow--right" id="pagination-right"></span></div>';
        this.container.innerHTML = markUp;
        this.buttons = Array.from(this.container.childNodes);
        this.buttons[this.currentPage].classList.add('pagination__page--active');
    }

    switchPage(event) {
        if(event.target.classList.contains('pagination__page') && event.target.classList.contains('pagination__arrow') === false && event.target.classList.contains('pagination__page__control--left') === false && event.target.classList.contains('pagination__page__control--right') === false) {
            this.buttons.forEach((button) => button.classList.remove('pagination__page--active'));
            this.currentPage = Number(event.target.textContent);
            test.currentPageMarkup = test.markup[this.currentPage - 1];
            test.renderTestPage(test.currentPageMarkup);
            this.render();
        } else if ((event.target.classList.contains('pagination__arrow--left') || event.target.classList.contains('pagination__page__control--left')) && this.currentPage > 1) {
            this.buttons.forEach((button) => button.classList.remove('pagination__page--active'));
            this.currentPage--;
            test.currentPageMarkup = test.markup[this.currentPage - 1];
            test.renderTestPage(test.currentPageMarkup);
            this.render();
        } else if ((event.target.classList.contains('pagination__arrow--right') || event.target.classList.contains('pagination__page__control--right')) && this.currentPage < this.totalPages) {
            this.buttons.forEach((button) => button.classList.remove('pagination__page--active'));
            this.currentPage++;
            this.buttons[this.currentPage].classList.add('pagination__page--active');
            test.currentPageMarkup = test.markup[this.currentPage - 1];
            test.renderTestPage(test.currentPageMarkup);
            this.render();
        }
    }
}