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
        content.addEventListener('click', this.saveResults.bind(this));
        content.addEventListener('click', this.sendResult.bind(this));
        this.filters = new Filters();
        this.allQuestions = [];
        this.markup = [];
        this.currentPageMarkup = [];
        this.result = {};
        this.topic = '';
    }

    render(event) {
        if(event.target !== this.openLink) {
            if (event.currentTarget === this.openLink || event.target.classList.contains('test-list__option')) {
                this.filters.render(event);
                this.renderMessage(event);
                this.filteredLink = document.getElementById('filter_button');
                this.filteredLink.addEventListener('click', this.renderFilteredTest.bind(this));
                if (event.target.textContent !== 'Tests') {
                    this.topic = event.target.textContent;
                    this.startButton = document.getElementById('start_test');
                    this.startButton.addEventListener('click', this.makeTest.bind(this));
                    this.getData(this.setDataUrls(event));
                }
            }
        }
    }

    renderFilteredTest(event) {
        this.renderMessage(event);
        this.getFilteredData(this.setDataUrls(event));
        this.startButton = document.getElementById('start_test');
        this.startButton.addEventListener('click', this.makeTest.bind(this));
    }

    renderMessage(event) {
        content.classList.add('content__test');
        if (event.target.textContent === 'Tests') {
            content.innerHTML = `
                                <p class="test__message">Please select area of your interest below or apply relevant filters</p>
                                <div class="tour__tests_list" id="tour-test-link">
                                    <button class="test-list__option" href="#">Frontend</button>
                                    <button class="test-list__option" href="#">Java</button>
                                    <button class="test-list__option" href="#">C++</button>
                                    <button class="test-list__option" href="#">Python</button>
                                    <button class="test-list__option" href="#">Ruby</button>
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
        this.markup = markup.map((elem, i) => i === markup.length - 1 ? `<ul class="questionnaire">${elem}</ul><button class="test__end_button" id="end-test">Submit Answers</button>` : `<ul class="questionnaire">${elem}</ul>`)
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

    setDataUrls(event) {
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
        let saveData = this.saveData.bind(this);
        let request = new XMLHttpRequest();
        request.open('get', url);
        request.send();
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            let data = JSON.parse(request.responseText);
            saveData(data);
        }
    }

    getFilteredData(arr) {
        this.allQuestions = [];
        let filters = this.filters;
        let saveData = this.saveData.bind(this);
        arr.forEach((url) => {
            let request = new XMLHttpRequest();
            request.open('get', url);
            request.send();
            request.onreadystatechange = function () {
                if (request.readyState !== 4) return;
                let data = JSON.parse(request.responseText);
                let filteredData = filters.selectQuestions(data);
                saveData(filteredData);
            }
        })
    }

    saveData (data) {
        data.forEach((elem) => this.allQuestions.push(elem));
    }

    makeTest() {
        this.pagination = new Pagination(this.allQuestions);
        this.markup = this.createTestMarkup(this.pagination.dataByPage);
        this.currentPageMarkup = this.markup[0];
        this.renderTestPage(this.currentPageMarkup);
        this.pagination.render();
        new Timer();
    }

    saveResults(event) {
        if (event.target.classList.contains('pagination__arrow') || event.target.classList.contains('pagination__page') || event.target.classList.contains('test__end_button')) {
            this.result = {};
            let questionArr = this.pagination.dataByPage[this.pagination.currentPage - 1];
            let questions = Array.from(document.getElementsByClassName('question'));
            let answers = questions.map((question) => {
                let options = Array.from(question.getElementsByClassName('question__button'));
                let answer;
                let answerText;
                if (options.length > 0) {
                    answer = options.find((option) => option.checked === true);
                    if (answer) {
                        return answerText = answer.parentNode.textContent;
                    } else {
                        return answerText = '';
                    }
                } else {
                    return answerText = 'not checked';
                }
            });
            questionArr.forEach((question, index) => {
                if (question.type === 'open') {
                    this.result[question.id] = '';
                } else {
                    if (question.answer === answers[index]) {
                        this.result[question.id] = 'correct';
                    } else {
                        this.result[question.id] = 'wrong';
                    }
                }
                sessionStorage.setItem('test_result', JSON.stringify(this.result));
                return this.result;
            })
        }
    }

    sendResult(event) {
        if (event.target.classList.contains('test__end_button')) {
            let correctAnswers = 0;
            let result = JSON.parse(sessionStorage.getItem('test_result'));
            let totalQuestions = Object.keys(result).length;
            for (let key in result) {
                result[key] === 'correct'? correctAnswers++ : correctAnswers;
            }
            let allRes = {
                test: this.topic,
                result: Math.round(correctAnswers / totalQuestions * 100)
            }
            this.showResults(allRes.result);
            /*let urlAll = '../data/results/all.json';
            let urlTopic = `../data/results/${this.topic}.json`;
            let requestAll = new XMLHttpRequest();
            requestAll.open('POST', urlAll);
            requestAll.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            requestAll.send(JSON.stringify(allRes));
            let topicResult;
            let requestTopic = new XMLHttpRequest();
            requestTopic.open('GET', urlTopic);
            requestTopic.onreadystatechange = function() {
                if (request.readyState !== 4) return;
                let data = JSON.parse(request.responseText);
                topicResult = data.map((elem) => {
                if (this.result[elem.id] === 'correct') {
                    return {
                        id: elem.id,
                        question: elem.question,
                        answercount: ++elem.answercount,
                        correctanswers: ++elem.correctanswers,
                        subcategory: elem.subcategory
                    }
                } else {
                    return {
                        id: elem.id,
                        question: elem.question,
                        answercount: ++elem.answercount,
                        correctanswers: elem.correctanswers,
                        subcategory: elem.subcategory
                    }
                }
                return topicResult;
            })
            }
            requestTopic.send(topicResult);*/
        }
    }
    showResults(res) {
        content.innerHTML = `<h3 class="content__header--small">You scored ${res} points.</h3><p class="content__text--centered">If your test included open questions, they will be evaluated additionally and added to your total score later</p>`
    }
}
