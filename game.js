const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader=document.getElementById("loader");
const game=document.getElementById("game");

let currentQuestion = {};
let score = 0;
let acceptingAnswers = false;
let questionCounter = 0;
let availableQuesions = [];
let questions=[];

fetch('https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple')
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        
        startGame();
    })
    .catch((err) => {
        console.error(err);
    });   

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 3;

startGame=() =>{
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () =>{
    if(availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS){
        localStorage.setItem("mostRecentScore",score);
        return window.location.assign('/end.html');
    }
    questionCounter++;
    //sorulaarı update edip hud yazması için
    progressText.innerText=`Soru ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width=`${(questionCounter/MAX_QUESTIONS)*100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choices) => {
        const number = choices.dataset['number'];
        choices.innerText = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex,1);
    acceptingAnswers = true;
};

choices.forEach((choices) => {
    choices.addEventListener('click' , (e) => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];
        //if ile doğru cevap kontrolü
        // const classToAplly='incorret';
        // if(selectedAnswer==currentQuestion.answer){
        //     classToAplly='correct';
        // }
        //2.kullanımı
        const classToAplly=selectedAnswer==currentQuestion.answer? "correct": "incorrect";
        if(classToAplly==="correct"){
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToAplly);
        setTimeout(()=>{
            selectedChoice.parentElement.classList.remove(classToAplly);
            getNewQuestion();
        },500);
        
    });

});
incrementScore=num=>{
    score+=num;
    scoreText.innerText=score;
}

