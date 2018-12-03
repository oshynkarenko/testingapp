import Chart from 'chart.js';
import {content} from './main.js';

export default class Statistics {
    constructor() {
        this.chartsContainer = document.getElementById('statistics-charts');
        this.tableContainer = document.getElementById('statistics-tables');
        this.openLink = document.getElementById('stats_link');
        this.openLink.addEventListener('click', this.render.bind(this));
        this.tableData = [];
    }

    render(event) {
        if (event.target.textContent === 'By language' || event.target.textContent === 'Statistics') {
            content.innerHTML = this.chartsContainer.textContent.trim();
            this.frontend_ctx = document.getElementById("stats-frontend");
            this.java_ctx = document.getElementById("stats-java");
            this.cplusplus_ctx = document.getElementById("stats-c++");
            this.python_ctx = document.getElementById("stats-python");
            this.ruby_ctx = document.getElementById("stats-ruby");
            this.renderCharts();
        } else if (event.target.textContent === 'By question') {
            content.innerHTML = this.tableContainer.textContent.trim();
            this.renderTable(event);
            this.tableControls = document.getElementById('table-controls');
            this.tableControls.addEventListener('click', this.renderTable.bind(this));
            this.tableControls.addEventListener('click', this.updateTableControls.bind(this));
            this.sortButton = document.getElementById('table-sort');
            this.sortButton.addEventListener('click', this.sortTable.bind(this));
        }
    }

    renderCharts() {
        this.renderChart(this.frontend_ctx, 'frontend');
        this.renderChart(this.java_ctx, 'java');
        this.renderChart(this.cplusplus_ctx, 'c++');
        this.renderChart(this.python_ctx, 'python');
        this.renderChart(this.ruby_ctx, 'ruby');
    }

    setApiUrl(event) {
        let apiUrl = '';
        if (event.target.textContent === 'By question') {
            apiUrl = '../data/results/frontend.json';
        } else {
            apiUrl = `../data/results/${event.target.textContent.toLowerCase()}.json`;
        }
        return apiUrl;
    }

    renderTable(event) {
        let apiUrl = this.setApiUrl(event);
        let renderCells = this.renderCells;
        let saveData = this.saveData.bind(this);
        let request = new XMLHttpRequest();
        request.open('get', apiUrl);
        request.send();
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            let data = JSON.parse(request.responseText);
            saveData(data);
            document.getElementById('statistics-table-body').innerHTML = renderCells(data);
        }
    }

    saveData (data) {
        this.tableData = data;
    }

    renderCells(data) {
        let cellsMarkUp = data.map((elem) => `<tr><td class="table__cell">${elem.question}</td><td class="table__result">${Math.round(elem.correctanswers / elem.answercount * 100)} %</td></tr>`);
        return cellsMarkUp.reduce((accum, elem) => accum + elem);
    }

    updateTableControls(event) {
        let prev = Array.from(this.tableControls.children).find((elem) => elem.classList.contains('table__controls__button--active'));
        prev.classList.remove('table__controls__button--active');
        event.target.classList.add('table__controls__button--active');
    }

    sortTable(event) {
        toggleSortButton();
        let sortedData = this.tableData.sort(sortData);
        document.getElementById('statistics-table-body').innerHTML = this.renderCells(sortedData);

        function toggleSortButton() {
            if (event.target.classList.contains('table__sort_button--down')) {
                event.target.classList.remove('table__sort_button--down');
                event.target.classList.add('table__sort_button--up')
            } else if (event.target.classList.contains('table__sort_button--up')) {
                event.target.classList.remove('table__sort_button--up');
                event.target.classList.add('table__sort_button--down')
            }
        }

        function sortData(obj1, obj2) {
            let res1 = Math.round(obj1.correctanswers / obj1.answercount * 100);
            let res2 = Math.round(obj2.correctanswers / obj2.answercount * 100);
            if (event.target.classList.contains('table__sort_button--down')) {
                if (res1 < res2) return 1;
                if (res1 > res2) return -1;
                return 0;
            } else if (event.target.classList.contains('table__sort_button--up')) {
                if (res1 > res2) return 1;
                if (res1 < res2) return -1;
                return 0;
            }
        }
    }

    renderChart(ctx, area) {
        let apiUrl = '../data/results/all.json';
        let request = new XMLHttpRequest();
        request.open('get', apiUrl);
        request.send();
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            let response = JSON.parse(request.responseText);
            let data = filter(response, area);
            createChart(ctx, data, area);
        }
        let filter = this.filterData;
        let createChart = this.createLangChart;
    }

    filterData(data, area) {
        let areaData = data.filter((elem) => elem.test === area);
        let resArr = [0, 0, 0, 0];
        areaData.map((elem) => {
            debugger;
            if (elem.result <= 25) {
                resArr[0]++;
            } else if (elem.result > 25 && elem.result <= 50) {
                resArr[1]++;
            } else if (elem.result > 50 && elem.result <= 75) {
                resArr[2]++;
            } else if (elem.result > 75 && elem.result <= 100) {
                resArr[3]++;
            }
        })
        return resArr;
    }

    createLangChart(ctx, data, area) {
        let myChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                datasets: [{
                    data: data,
                    backgroundColor: [
                        "#ebebeb",
                        "#66697b",
                        "#2494a9",
                        "#4c9766"
                    ]
                }],
                labels: ['Below 25%', '26 - 50%', '51 - 75%', 'Over 75%']
            },
            options: {
                startAngle: -Math.PI / 4,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 50,
                        stepSize: 5,
                        fontColor: '#178286'
                    },
                    gridLines: {
                        color: '#ebebeb'
                    },
                },
                aspectRatio: 1.5,
                legend: {
                    position: 'left',
                    labels: {
                        fontColor: '#ebebeb'
                    }
                },
                animation: {
                    animateRotate: false
                },
                title: {
                    display: true,
                    fontColor: '#ebebeb',
                    padding: 20,
                    text: area.toUpperCase()
                }
            }
        });
    }
}