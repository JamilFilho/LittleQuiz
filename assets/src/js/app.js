var app = new Vue({
    el: '#quiz-app',
    data: {
        quiz: [],
        index: Math.floor(Math.random() * 10), // Start index
        responseIndex: 0, // Correct Answer
        lifes: 3, // Initial lifes
        coins: Number(localStorage.getItem("coins")), // Initial coins
        hits: 0, // Total of hits
        atualIndex: [],
        timeInit: 0, // Time Init
        time: 0, // Time count
        rank: 0, // Rank
        end: false
    },
    methods: {
        saveIndex: function(index) {
            this.atualIndex.push(index);
        },
        alternateIndex: function(index) {
            this.saveIndex(this.index); 
            // Save the atual question
            if(this.atualIndex.length < this.quiz.length) { 
                // Checks if the number of questions answered is less than the total number of questions 
                while (this.atualIndex.includes(this.index)) {
                    this.index = Math.floor(Math.random() * this.quiz.length); 
                    // Get a new question
                }
            }
            if(this.atualIndex.length === this.quiz.length) { 
                // Checks whether the number of questions answered equals the total number of questions
                this.playSound('./assets/sounds/start-end/win.wav');
                this.end = true;
            }
        },
        sendResponse: function() {
            if (Number(this.responseIndex) != this.question["ans"]) {
                this.lifes = this.lifes - 1; // Remove 1 life
                this.playSound('./assets/sounds/lifes/loseOne.wav'); // Play Sound
            }
            if (Number(this.responseIndex) == this.question["ans"]) {
                this.hits = this.hits + 1; // Calc total of hits
                this.coins = this.coins + 10; // Add coins
                this.playSound('./assets/sounds/coins/receiveOne.wav'); // Play Sound
            }
            this.playSound('./assets/sounds/buttons/send.wav'); // Play Sound
            this.alternateIndex(); // Alternate index question
        },
        skipResponse: function() {
            this.coins = this.coins - 5; // Add coins
            this.playSound('./assets/sounds/buttons/send.wav'); // Play Sound
            this.alternateIndex(); // Alternate index question
        },
        timer: function() {
            setInterval(() => {
                if (this.time > 0 && this.lifes > 0 && this.end === false) { // If time is greater than zero and If lifes not equal zero
                    return (this.time = this.time - 1); // Subtract 1(one) from the current time
                    }
                }, 1000);
        },
        checkCoins: function() {
            let coins = this.coins;
            if(this.lifes != 0) {
                coins = localStorage.getItem("coins"); // Get in LocalStorage the latest coin update
            }
            if(this.lifes === 0) {
                coins = localStorage.setItem("coins", `${this.coins}`); // Update coins on Local Storage
            }
            return coins;
        },
        checkRank: function() {
            let lifes = this.lifes;
            if (lifes >= 0) { // If lifes is grather or equal zero
                this.rank = localStorage.getItem("rank"); // Get Rank from LocalStorage
            }
            if (this.atualIndex.length - 1 > this.rank) { // If hits are higher than the current rank
                this.rank = this.atualIndex.length; // Get new rank
                localStorage.setItem("rank", `${this.rank}`); // Save new rank
            }
        },
        restartQuiz: function() {
            this.responseIndex = 0; // Reset Response Index
            this.lifes = 3; // Reset Lifes
            this.atualIndex = []; // Reset Atual index
            this.end = false,
            this.playSound('./assets/sounds/start-end/start.wav'); // Play Sound
        },
        helpQuestion: function(coins, event) {
            this.coins = this.coins - 5;
            this.playSound('./assets/sounds/buttons/help.wav');
        },
        playSound: function(sound) {
            var audio = new Audio(sound);
            audio.play();
        }
    },
    computed: {
        question: function() {
            let question = {
                "title": "Aguarde estamos carregando as perguntas",
                "op1": "Carregando...",
                "op2": "Carregando...",
                "op3": "Carregando...",
                "op4": "Carregando...",
                "ans": 0,
                "hard": 1
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
                this.playSound('./assets/sounds/time/tenSec.wav');
            } else if (this.time <= 15) {
                className = 'is-warning';
            } else if (this.time >= 16) {
                className = 'is-success';
            }
            return className;
        },
        linkTwitter: function() {
            twitter = 'https://twitter.com/intent/tweet?text=Meu%20record%20no%20%23LittleQuiz%20foi%20de%20' + this.rank + '%20acertos.%20Bora%20tentar?%20https%3A%2F%2Fquiz.littleson.com.br @um_littleson';
            return twitter;
        },
        linkWhatsapp: function() {
            whatsapp = 'https://api.whatsapp.com/send?text=Meu%20record%20no%20%23LittleQuiz%20foi%20de%20' + this.rank + '%20acertos.%20Bora%20tentar?%20https%3A%2F%2Fquiz.littleson.com.br';
            return whatsapp;
        },
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
            if(this.time <= 0 && this.end === false) {
                this.lifes = this.lifes - 1; // Remove 1 life
                this.playSound('./assets/sounds/lifes/loseOne.wav');
                return this.skipResponse(); // Skip to next question
            }
        },
        lifes: function () {
            this.checkRank();
            this.checkCoins();
            if(this.lifes === 0) {
                this.playSound('./assets/sounds/lifes/loseAll.wav');
            }
        },
        coins: function() {
            if(this.coins === 100) {
                this.playSound('./assets/sounds/coins/receiveHundred.wav');
            }
        }
    }
});
Vue.config.productionTip = false;
//# sourceMappingURL=app.js.map