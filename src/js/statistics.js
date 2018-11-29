import Chart from 'chart.js';

export default class Statistics {
    constructor() {
        this.chartsContainer = document.getElementById('statistics-charts');
        this.tableContainer = document.getElementById('statistics-tables');
        this.openLink = document.getElementById('stats_link');
        this.openLink.addEventListener('click', this.render.bind(this));
        this.tableData = [];
    }
    render() {
        event.preventDefault();
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
            this.renderTable('frontend');
            this.tableControls = document.getElementById('table-controls');
            this.tableControls.addEventListener('click', this.renderTable.bind(this));
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
                        max: 10,
                        stepSize: 1
                    }
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

       renderTable() {
        event.preventDefault();
           let apiUrl = '';
           if(event.target.textContent === 'By question') {
               apiUrl = '../data/results/frontend.json';
           } else {
               apiUrl = `../data/results/${event.target.textContent.toLowerCase()}.json`;
               let prev = Array.from(this.tableControls.children).find((elem) => elem.classList.contains('table__controls__button--active'));
               prev.classList.remove('table__controls__button--active');
               event.target.classList.add('table__controls__button--active');
           }
           fetch(apiUrl, {method: "GET"})
               .then((response) => response.json())
               .then((data) => {
                   document.getElementById('statistics-table-body').innerHTML = this.renderCells(data);
                   return this.tableData = data;
               })
               .catch((error) => alert(error + 'Unfortunately, the server is currently under maintenance. Please try again later'));
    }

    renderCells(data) {
        let cellsMarkUp = data.map((elem) => `<tr><td>${elem.question}</td><td class="table__result">${Math.round(elem.correctanswers / elem.answercount * 100)} %</td></tr>`);
        return cellsMarkUp.reduce((accum, elem) => accum + elem);
    }

    sortTable() {
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
        fetch(apiUrl, {method: "GET"})
            .then((response) => response.json())
            .then((data) => this.filterData(data, area))
            .then((res) => this.createLangChart(ctx, res, area))
            .catch((error) => alert(error + 'Unfortunately, the server is currently under maintenance. Please try again later'))
    }

    filterData(data, area) {
        let areaData = data.filter((elem) => elem.test === area);
        let resArr = [0, 0, 0, 0];
        areaData.map((elem) => {
            if (elem.result <= 25) {
                resArr[0]++;
            } else if (elem.result > 25 && elem.result <= 50){
                resArr[1]++;
            } else if (elem.result > 50 && elem.result <= 75){
                resArr[2]++;
            } else if (elem.result > 75 && elem.result <= 100){
                resArr[3]++;
            }

        })
        return resArr;
    }
}