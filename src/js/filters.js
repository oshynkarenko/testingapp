import {content} from "./main";

export default class Filters {
    constructor() {
        this.openLink = document.getElementById('test_link');
        this.container = document.getElementById('filters');
        this.container.addEventListener('input', this.checkOptions.bind(this));
        document.querySelector('.header').addEventListener('click', this.removeFilters.bind(this));
    }

    render(event) {
        this.container.classList.add('sidebar--active');
        this.container.innerHTML = document.getElementById('test_filters').textContent.trim();
        this.options = Array.from(document.getElementsByClassName('filter__option'));
        this.topicOptions = Array.from(document.getElementsByClassName('filter__suboption--topic'));
        this.typeOptions = Array.from(document.getElementsByClassName('filter__suboption--type'));
        this.filterItems = Array.from(document.getElementsByClassName('filter__item'));
        this.filterItems.forEach((item) => item.addEventListener('input', this.checkOptions.bind(this)));
        this.checkFilters(event);
    }

    removeFilters(event) {
        if (event.target.textContent !== 'Tests' && event.target.parentNode.parentNode !== this.openLink && event.target.classList.contains('header__top') === false) {
            this.container.classList.remove('sidebar--active');
            content.classList.remove('content__test');
        }
    }

    checkFilters(event) {
        let selectedArea = this.options.find((option) => option.parentNode.textContent === event.target.textContent);
        if (selectedArea) {
            selectedArea.setAttribute('checked', 'true');
            let itemsToCheck = Array.from(selectedArea.parentNode.parentNode.querySelector('.filter__suboptions').children);
            itemsToCheck.forEach((item) => item.querySelector('.filter__suboption').setAttribute('checked', 'true'));
        }
    }

    checkOptions(event) {
        debugger;

        if (event.target.classList.contains('filter__option')) {
            if(event.target.checked === true) {
                let selectedArea = event.target;
                let itemsToCheck = Array.from(selectedArea.parentNode.parentNode.querySelector('.filter__suboptions').children);
                itemsToCheck.forEach((item) => item.querySelector('.filter__suboption').setAttribute('checked', 'true'));
            } else {
                let selectedArea = event.target;
                let itemsToUncheck = Array.from(selectedArea.parentNode.parentNode.querySelector('.filter__suboptions').children);
                itemsToUncheck.forEach((item) => item.querySelector('.filter__suboption').removeAttribute('checked'));
            }
        } else if (event.target.classList.contains('filter__suboption--topic')){
            if (event.currentTarget.classList.contains('filter__item')) {
                event.currentTarget.querySelector('.filter__option').setAttribute('checked', 'true');
            }
        }
    }

    selectQuestions(arr) {
        let selectedTopicsArr = this.topicOptions.filter((option) => option.checked === true);
        let selectedTypeArr = this.typeOptions.filter((option) =>  option.checked === true);
        let selectedTopics = selectedTopicsArr.map((option) => option.parentNode.textContent.toLowerCase());
        let selectedTypes = selectedTypeArr.map((option) => option.parentNode.textContent.toLowerCase());
        let topicRes = arr.filter((elem) => selectedTopics.includes(elem.subcategory));
        let res;
        selectedTypes.length > 0 ? res = topicRes.filter((elem) => selectedTypes.includes(elem.complexity) || selectedTypes.includes(elem.type)): res = topicRes;
        return res;
    }
}