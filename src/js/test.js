import {body, content} from "./main";
import Filters from './filters';
import Timer from './timer';
import Pagination from "./pagination";

export default class Test {
    constructor() {
        this.openLink = document.getElementById('test_link');
        this.createLink = document.getElementById('create_test_link');
        this.openLink.addEventListener('click', this.render.bind(this));
        content.addEventListener('click', this.render.bind(this));
        //this.createLink.addEventListener('click', this.getAllQuestions.bind(this));
        this.filters = new Filters();
        this.allQuestions = [];
        this.markup = [];
        this.currentPageMarkup = [];
    }

    render() {
        event.preventDefault();
        if (event.currentTarget === this.openLink || event.target.classList.contains('test-list__option')) {
            this.filters.render();
            this.renderMessage();
            this.filteredLink = document.getElementById('filter_button');
            this.filteredLink.addEventListener('click', this.renderFilteredTest.bind(this));
            if (event.target.textContent !== 'Tests') {
                this.startButton = document.getElementById('start_test');
                this.startButton.addEventListener('click', this.makeTest.bind(this));
                this.getData(this.setDataUrls());
            }
        }
    }

    renderFilteredTest() {
        this.renderMessage();
        this.getFilteredData(this.setDataUrls());
    }

    renderMessage() {
        content.classList.add('content__test');
        if (event.target.textContent === 'Tests') {
            content.innerHTML = `
                                <p class="test__message">Please select area of your interest below or apply relevant filters</p>
                                <div class="tour__tests_list" id="tour-test-link">
                                    <a class="test-list__option" href="#">Frontend</a>
                                    <a class="test-list__option" href="#">Java</a>
                                    <a class="test-list__option" href="#">C++</a>
                                    <a class="test-list__option" href="#">Python</a>
                                    <a class="test-list__option" href="#">Ruby</a>
                                </div>
                                `
        } else {
            content.innerHTML = `<p class="test__message">Once you are ready to start the test, please click 
                                <button class="timer_block__button" id="start_test">START ATTEMPT</button>
                             </p>`;
        }
    }

    createTestMarkup(data) {
        let markup = data.map((elem) => createQuestionsMarkup(elem));
        this.markup = markup.map((elem, i) => i === markup.length - 1 ? `<ul class="questionnaire">${elem}</ul><button class="test__end_button">Submit Answers</button>` : `<ul class="questionnaire">${elem}</ul>`)
        return this.markup;

        function createOptionsMarkup(elem) {
            let markupArr = elem.options.map((option) => `<li class="question__option"><label><input type="radio" name=${elem.id} class="question__button">${option}</label></li>`);
            return markupArr.reduce((accum, elem) => accum + elem);
        }

        function createQuestionsMarkup(data) {
            let optionsMarkup = data.map((elem) => (elem.options !== 'null') ? createOptionsMarkup(elem) : '<textarea class="question__option" rows="5"></textarea>');
            let questionnaireMarkup = data.map((elem, i) => `<li class="question">${elem.question}<ul class="question__options">${optionsMarkup[i]}</ul></li>`);
            return questionnaireMarkup.reduce((accum, elem) => accum + elem);
        }
    }

    renderTestPage(markup) {
        content.innerHTML = markup;
    }

    setDataUrls() {
        if (event.target.textContent !== 'Tests') {
            if (event.target.textContent === 'Apply Filters') {
                let selectedAreas = Array.from(this.filters.options).filter((elem) => elem.checked === true);
                return selectedAreas.map((area) => `../data/questions/${area.labels[0].textContent.toLowerCase()}.json`);
            } else {
                return `../data/questions/${event.target.textContent.toLowerCase()}.json`;
            }
        }
    }

    getData(url) {
        this.allQuestions = [];
        fetch(url, {method: "GET"})
            .then((response) => response.json())
            .then((data) => data.map((elem) => this.allQuestions.push(elem)))
            .catch((error) => alert(error + 'Unfortunately, the server is currently under maintenance. Please try again later'))
    }

    getFilteredData(arr) {
        this.allQuestions = [];
        Promise.all(arr.map((url) => fetch(url, {method: "GET"})
            .then((response) => response.json())))
            .then((data) => data.reduce((accum, elem) => accum.concat(elem)))
            .then((res) => this.filters.selectQuestions(res))
            .then((questions) => questions.forEach((elem) => this.allQuestions.push((elem))))
            .catch((error) => alert(error + 'Unfortunately, the server is currently under maintenance. Please try again later'))
    }

    makeTest() {
        this.pagination = new Pagination(this.allQuestions);
        this.markup = this.createTestMarkup(this.pagination.dataByPage);
        this.currentPageMarkup = this.markup[0];
        this.renderTestPage(this.currentPageMarkup);
        this.pagination.render();
        new Timer();
    }
}
