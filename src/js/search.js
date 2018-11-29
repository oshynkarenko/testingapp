import {body, content, test} from './main';

export default class Search {
    constructor() {
        this.container = {};
        this.categorized = document.querySelector('.search_block--categorized');
        body.addEventListener('click', this.showResults.bind(this));
        document.querySelector('.header').addEventListener('click', this.updateLayout.bind(this));
    }

    updateLayout() {
        debugger;
        if (event.target === document.getElementById('logo')) {
            this.categorized.classList.add('search_block--home');
        } else {
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
        Promise.all(arr.map((url) => fetch(url, {method: "GET"})
            .then((response) => response.json())))
            .then((data) => data.reduce((accum, elem) => accum.concat(elem)))
            .then((result) => this.findInput(result))
            .then((questions) => this.renderQuestionList(questions))
            .catch((error) => alert(error + 'Unfortunately, the server is currently under maintenance. Please try again later'))
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
            content.innerHTML = questionsMarkupArr.reduce((accum, elem) => accum + elem);
        } else {
            content.innerHTML = '<p class="content__text--centered">No results found</p>';
        }
    }

    showResults(event) {
        if (event.target.classList.contains('search_block__button') || event.target.classList.contains('button__icon')) {
            this.container = event.target.parentNode.parentNode || event.target.parentNode.parentNode.parentNode;
            this.getQuestionList(event);
        }
    }
}