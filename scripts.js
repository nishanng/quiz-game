const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const categorySelection = document.getElementById('category-selection');
const categoriesSelect = document.getElementById('categories');
const startQuizButton = document.getElementById('start-quiz');
const quizElement = document.getElementById('quiz');
const questionContainer = document.getElementById('question-container');
const questionText = document.querySelector('.question-text');
const answersContainer = document.querySelector('.answers');
const progress = document.getElementById('progress');
const currentQuestionElement = document.getElementById('current-question');
const nextQuestionButton = document.getElementById('next-question');
const results = document.getElementById('results');
const scoreElement = document.getElementById('score').querySelector('span');
const playAgainButton = document.getElementById('play-again');

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userForm.classList.add('hidden');
    categorySelection.classList.remove('hidden');
});

// Fetch categories and populate the select element
fetch('https://opentdb.com/api_category.php')
    .then((response) => response.json())
    .then((data) => {
        data.trivia_categories.forEach((category) => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoriesSelect.appendChild(option);
        });
    });

startQuizButton.addEventListener('click', () => {
    categorySelection.classList.add('hidden');
    fetchQuestions(categoriesSelect.value);
});

nextQuestionButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
});

playAgainButton.addEventListener('click', () => {
    results.classList.add('hidden');
    categorySelection.classList.remove('hidden');
    currentQuestionIndex = 0;
    correctAnswers = 0;
});

function fetchQuestions(category) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`)
        .then((response) => response.json())
        .then((data) => {
            questions = data.results;
            quizElement.classList.remove('hidden');
            showQuestion();
        });
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';

    const correctAnswerIndex = Math.floor(Math.random() * 4);
    question.incorrect_answers.splice(correctAnswerIndex, 0, question.correct_answer);

    question.incorrect_answers.forEach((answer, index) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer-option');

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.id = `answer-${index}`;
        input.value = answer;

        const label = document.createElement('label');
        label.htmlFor = `answer-${index}`;
        label.textContent = answer;

        answerElement.appendChild(input);
        answerElement.appendChild(label);
        answersContainer.appendChild(answerElement);

        answerElement.addEventListener('click', () => {
            if (!nextQuestionButton.classList.contains('hidden')) return;

            if (input.value === question.correct_answer) {
                correctAnswers++;
            }

            nextQuestionButton.classList.remove('hidden');
            answerElement.classList.add('selected');
            if (input.value === question.correct_answer) {
                answerElement.classList.add('correct');
            } else {
                answerElement.classList.add('incorrect');
                const correctElement = [...answersContainer.children].find((child) =>
                child.querySelector('input').value === question.correct_answer
            );
            correctElement.classList.add('correct');
        }
    });
});

currentQuestionElement.textContent = currentQuestionIndex + 1;
nextQuestionButton.classList.add('hidden');
}

function showResults() {
quizElement.classList.add('hidden');
results.classList.remove('hidden');
scoreElement.textContent = correctAnswers;
}
