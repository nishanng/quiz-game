const userForm = document.getElementById('user-form');
const usernameInput = document.getElementById('username');
const categorySelection = document.getElementById('category-selection');
const categoryForm = document.getElementById('category-form');
const categoriesSelect = document.getElementById('categories');
const startQuizButton = document.getElementById('start-quiz');
const greeting = document.getElementById('greeting');
const quizElement = document.getElementById('quiz');
const questionContainer = document.getElementById('question-container');
const questionText = document.querySelector('.question-text');
const answersContainer = document.querySelector('.answers');
const progress = document.getElementById('progress');
const currentQuestionElement = document.getElementById('current-question');
const nextQuestionButton = document.getElementById('next-question');
const results = document.getElementById('results');
const scoreElement = document.getElementById('score');
const playAgainButton = document.getElementById('play-again');

let questions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

userForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userForm.classList.add('hidden');
    greeting.textContent = `Hello, ${usernameInput.value}!`;
    categorySelection.classList.remove('hidden');
});

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    categorySelection.classList.add('hidden');
    fetchQuestions(categoriesSelect.value).then(() => {
        showNextQuestion();
        quizElement.classList.remove('hidden');
    });
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

nextQuestionButton.addEventListener('click', () => {
    if (currentQuestionIndex < 4) {
        currentQuestionIndex++;
        showNextQuestion();
    } else {
        showResults();
    }
});

playAgainButton.addEventListener('click', () => {
    results.classList.add('hidden');
    currentQuestionIndex = 0;
    correctAnswers = 0;
    userForm.classList.remove('hidden');
});

function fetchQuestions(categoryId) {
    return fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`)
        .then((response) => response.json())
        .then((data) => {
            questions = data.results;
        });
}

function showNextQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answersContainer.innerHTML = '';

    const answers = [...question.incorrect_answers, question.correct_answer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach((answer) => {
        const answerElement = document.createElement('div');
        answerElement.classList.add('answer-option');
        answerElement.innerHTML = `
            <input type="radio" name="answer" value="${answer}">
            <label>${answer}</label>
        `;
        answerElement.addEventListener('click', handleAnswerClick);
        answersContainer.appendChild(answerElement);
    });

    currentQuestionElement.textContent = currentQuestionIndex + 1;
    nextQuestionButton.classList.add('hidden');
}

function handleAnswerClick(e) {
    const answerElement = e.currentTarget;
    const answer = answerElement.querySelector('input').value;

    if (answer === questions[currentQuestionIndex].correct_answer) {
        correctAnswers++;
    }

    nextQuestionButton.classList.remove('hidden');
    answerElement.classList.add(answer === questions[currentQuestionIndex].correct_answer ? 'correct' : 'incorrect');
    answersContainer.childNodes.forEach((el) => el.removeEventListener('click', handleAnswerClick));
}

function showResults() {
    quizElement.classList.add('hidden');
    results.classList.remove('hidden');

    if (correctAnswers >= 3) {
        scoreElement.textContent = `Well done, you answered ${correctAnswers} questions right!`;
    } else {
        scoreElement.textContent = `That was a good attempt, you answered ${correctAnswers} questions right. Would you like to try again?`;
    }
}

