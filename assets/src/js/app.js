require('howler');
var app = new Vue({
    el: '#quiz-app',
    data: {
        quiz: [],
        quizShow: [],
        index: Math.floor(Math.random() * 10), // Start index
        responseIndex: 0, // Correct Answer
        lifes: 3, // Initial lifes
        coins: 10,
        hits: 0, // Total of hits
        atualIndex: [],
        timeInit: 0, // Time Init
        time: 0, // Time count
        rank: 0, // Rank
        error: 0,
    },
    methods: {
        saveIndex: function(index) {
            this.atualIndex.push(index);
        },
        alternateIndex: function(index) {
            this.saveIndex(this.index);
            while (this.atualIndex.includes(this.index)) {
                this.index = Math.floor(Math.random() * 10);
            }
        },
        sendResponse: function() {
            if (Number(this.responseIndex) != this.question["ans"]) {
                this.lifes = this.lifes - 1; // Remove 1 life
            }
            if (Number(this.responseIndex) == this.question["ans"]) {
                this.hits = this.hits + 1; // Calc total of hits
                this.coins = this.coins + 10; // Add coins
            }
            this.sendSound();
            this.alternateIndex(); // Alternate index question
        },
        skipResponse: function() {
            this.alternateIndex(); // Alternate index question
        },
        restartQuiz: function() {
            this.responseIndex = 0; // Reset Response Index
            this.index = 0; // Reset Index
            this.lifes = 3; // Reset Lifes
            this.atualIndex = []; // Reset Atual index
        },
        timer: function() {
            setInterval(() => {
                if (this.time > 0 && this.lifes > 0) {
                    return (this.time = this.time - 1);
                }
            }, 1000);
        },
        checkCoins: function() {
            let coins = this.coins;
            if(this.lifes != 0) {
                coins = localStorage.getItem("coins"); // Get in LocalStorage te latest coin update
            }
            if(this.lifes === 0) {
                coins = localStorage.setItem("coins", `${this.coins}`); // Update coins on Local Storage
            }
            return coins;
        },
        checkRank: function() {
            let lifes = this.lifes;
            if (lifes >= 0) {
                this.rank = localStorage.getItem("rank");
            }
            if (this.atualIndex.length - 1 > this.rank) {
                this.rank = this.atualIndex.length;
                localStorage.setItem("rank", `${this.rank}`);
            }
        },
        helpQuestion: function(coins, event) {
            this.coins = this.coins - 5;
        },
        sendSound: function() {
            var sound = new Howl({
                src: '../../sounds/buttons/send.wav',
                volume: 0.5,
            });
            sound.play();
        }
    },
    computed: {
        question: function() {
            let question = {
                "title": "Aguarde, estamos carregando as perguntas.",
                "op1": "Carregando...",
                "op2": "Carregando...",
                "op3": "Carregando...",
                "op4": "Carregando...",
                "ans": 0,
                "hard": 0
            };
            this.quiz.length > 0 && (question = this.quiz[this.index]);
            switch(question['hard']) {
                case 1:
                    this.time = 15
                    this.timeInit = 15
                    break;
                case 2:
                    this.time = 20
                    this.timeInit = 20
                    break;
                case 3:
                    this.time = 25
                    this.timeInit = 25
                    break;
                case 4:
                    this.time = 30
                    this.timeInit = 30
                    break;
                default:
                    this.timeInit = 30
                    this.time = 30
            }
            return question;
        },
        progressStyle: function() {
            if(this.time <= 10) {
                className = 'is-error';
            } else if (this.time <= 15) {
                className = 'is-warning';
            } else if (this.time >= 16) {
                className = 'is-success';
            }
            return className;
        }
    },
    mounted: function() {
        this.timer();
        fetch("./data/questions.json").then(quizResponse => {
            quizResponse.json().then(json => {
                this.quiz = json;
            });
        });
    },
    watch: {
        time: function () {
            if(this.time <= 0) {
                this.lifes = this.lifes - 1; // Remove 1 life
                return this.skipResponse(); // Skip to next question
            }
        },
        lifes: function () {
            this.checkRank();
            this.checkCoins();
        }
    }
});
Vue.config.productionTip = false;