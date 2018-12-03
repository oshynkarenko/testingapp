import {body, content, test} from './main';

export default class Search {
    constructor() {
        this.container = {};
        this.categorized = document.querySelector('.search_block--categorized');
        body.addEventListener('click', this.showResults.bind(this));
        document.querySelector('.header__top').addEventListener('click', this.updateLayout.bind(this));
        this.searchResults = [];
    }

    updateLayout(event) {
        if (event.target === document.getElementById('logo')) {
            this.categorized.classList.add('search_block--home');
        } else if (event.target.classList.contains('menu__item--dropdown') === false) {
            this.categorized.classList.remove('search_block--home');
        }
        if (content.classList.contains('content__search_results')) {
            content.classList.remove('content__search_results');
            this.container.querySelector('.search_block__field').value = '';
            if (this.container.querySelector('.search_block__categories')) {
                this.container.querySelector('.search_block__categories').value = 'Everywhere'
            }
        }
    }

    setDataUrls() {
                this.selectedAreas = this.container.querySelector('.search_block__categories') ? this.container.querySelector('.search_block__categories').value.toLowerCase() : 'everywhere';
                if (this.selectedAreas === 'everywhere') {
                   return ['../data/questions/frontend.json', '../data/questions/java.json', '../data/questions/c++.json', '../data/questions/python.json', '../data/questions/ruby.json'];
                } else {
                   return [`../data/questions/${this.selectedAreas}.json`];
                }
    }

    getData(event, arr) {
        this.searchResults = [];
        let searchData = [];
        this.markup = '';
        let saveData = this.saveData.bind(this);
        let findInput = this.findInput.bind(this);
        let renderQuestionList = this.renderQuestionList.bind(this);
        arr.forEach((url, i) => {
            let request = new XMLHttpRequest();
            request.open('get', url);
            request.send();
            request.onreadystatechange = function () {
                if (request.readyState !== 4) return;
                let data = JSON.parse(request.responseText);
                let requestRes = findInput(data);
                requestRes.forEach((elem) => searchData.push(elem));
                saveData(searchData);
                if (i === arr.length - 1) {
                    renderQuestionList(searchData);
                }
            }
        })
    }

    saveData (data) {
        data.forEach((elem) => this.searchResults.push(elem));
    }

    findInput(data) {
        this.query = this.container.querySelector('.search_block__field').value.toLowerCase();
        return data.filter((elem) => elem.question.includes(this.query));
    }

    getQuestionList(event) {
        this.getData(event, this.setDataUrls());
    }

    renderQuestionList(data) {

        let questionsMarkupArr = data.map((elem) => `<p class="content__text--centered">${elem.question}</p>`);
            content.classList.add('content__search_results');
        if (questionsMarkupArr.length > 0) {
            content.innerHTML = '<h2 class="content__header--small">Questions containing search words</h2>' + questionsMarkupArr.reduce((accum, elem) => accum + elem);
        } else {
            content.innerHTML = '<p class="content__text--centered">No results found</p>';
        }
    }

    showResults(event) {
        if (event.target.classList.contains('search_block__button') || event.target.classList.contains('button__icon')) {
            document.getElementById('filters').classList.remove('sidebar--active');
            document.getElementById('filters').innerHTML = '';
            document.getElementById('timer-block').innerHTML = '';
            this.categorized.classList.remove('search_block--home');
            this.container = event.target.parentNode.parentNode || event.target.parentNode.parentNode.parentNode;
            this.getQuestionList(event);
        }
    }
}