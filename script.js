
                    //        /\
                //  |        /  \
            //  |   |       /    \   ROJECT
        //  |   |   |       \    /    QUIZ
    //  |   |   |   |        \  /
//  |   |   |   |   |         \/
//  |   |   |   |   |          \
    //  |   |   |   |           \
        //  |   |   |            \
            //  |   |             \
                //  |              \
                    //              \



// Bing Rewritten Version of my code
// Variables
let currentQuestionIndex = 0;
let quizOver = false;
let userAnswers = [];
let quizData = [];
let timerInterval;

// Get the progress bar and timer elements
const progressBar = document.getElementById('progressBar');
const timerElement = document.getElementById('timer');

// Function to update the progress bar
function updateProgressBar(currentQuestionIndex, totalQuestions) {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = progress + '%';
}

// Function to display a question
function showQuestion() {
    const questionData = quizData[currentQuestionIndex];
    document.getElementById('number').innerHTML = `Question ${currentQuestionIndex + 1}/${quizData.length}`;
    document.getElementById('question').innerHTML = `<p>${questionData.question}</p>`;
    const answers = document.getElementById('allBtn');
    answers.innerHTML = '';
    questionData.answers.forEach((answer, index) => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.id = `btn${index + 1}`;
        button.innerHTML = answer.text;
        button.className = answer.correct ? 'correct' : '';
        li.appendChild(button);
        answers.appendChild(li);
    });
    updateProgressBar(currentQuestionIndex, quizData.length);
}

// Function to end the quiz
function endQuiz() {
    quizOver = true;
    document.querySelector('.container').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    const score = userAnswers.filter(answer => answer).length;
    document.getElementById('score').textContent = `You got ${score} out of ${quizData.length} questions correct.`;
}

// Event listener for the start button
document.getElementById('startBtn').addEventListener('click', function() {
    document.getElementById('startPage').style.display = 'none';
    document.querySelector('.container').style.display = 'block'; 
    showQuestion();
    let quizTime = document.getElementById('quizTime').value || 300;
    document.getElementById('quizTime').value = '';
    let timeLeft = quizTime;
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(function() {
        if (quizOver || timeLeft <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
        timeLeft--;
        timerElement.textContent = `Time left: ${timeLeft}s`;
    }, 1000);
});

// Event listener for the add question form
document.getElementById('addQuestionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let newQuestion = document.getElementById('newQuestion').value;
    let newAnswers = [
        document.getElementById('newAnswer1').value,
        document.getElementById('newAnswer2').value,
        document.getElementById('newAnswer3').value,
        document.getElementById('newAnswer4').value
    ];
    let newQuizData = {
      question: newQuestion,
      answers: newAnswers.map((answer, index) => {
        let correctAnswer = document.querySelector('input[name="correctAnswer"]:checked').value;
        return { text: answer, correct: correctAnswer === String(index + 1) };
      })
    };
    quizData.push(newQuizData);
    console.log(quizData);
    document.getElementById('newQuestion').value = '';
    newAnswers.forEach((_, index) => {
    document.getElementById(`newAnswer${index + 1}`).value = '';
  });
    document.querySelector('input[name="correctAnswer"]:checked').checked = false;
});

// Event listener for the answer buttons
document.getElementById('allBtn').addEventListener('click', function(e) {
    if (e.target && e.target.nodeName == 'BUTTON') {
        const correctClass = 'correct';
        const checkedClass = 'checked';
        const allButtons = document.querySelectorAll('#allBtn button');
        allButtons.forEach(button => {
            button.disabled = false;
            button.innerHTML = button.textContent;
            button.classList.remove('corrected', 'incorrect', checkedClass);
        });
        selectedButton = e.target;
        if (e.target.classList.contains(correctClass)) {
            userAnswers[currentQuestionIndex] = true;
        } else {
            userAnswers[currentQuestionIndex] = false;
        }
        e.target.disabled = true;
        e.target.classList.add(checkedClass); 
        updateProgressBar(currentQuestionIndex, quizData.length); 
    }
});

// Event listener for the check button
document.getElementById('checkBtn').addEventListener('click', function() {
    if (selectedButton) {
        const correctClass = 'correct';
        const correctedClass = 'corrected';
        const incorrectClass = 'incorrect';
        const checkMark = '<i class="fa-solid fa-circle-check"></i>';
        const crossMark = '<i class="fa-solid fa-circle-xmark"></i>';
        const defaultText = selectedButton.textContent;
        if (selectedButton.classList.contains(correctClass)) {
            selectedButton.innerHTML = `${defaultText} ${checkMark}`;
            selectedButton.classList.add(correctedClass);
        } else {
            selectedButton.innerHTML = `${defaultText} ${crossMark}`;
            selectedButton.classList.add(incorrectClass);
        }
        const allButtons = document.querySelectorAll('#allBtn button');
        allButtons.forEach(button => button.disabled = true);
        selectedButton = null;
        updateProgressBar(currentQuestionIndex, quizData.length);
    }
});

// Event listener for the next button
document.getElementById('nextBtn').addEventListener('click', function() {
    if (quizOver) {
        return;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        showQuestion();
        updateProgressBar(currentQuestionIndex, quizData.length);
    } else {
        endQuiz();
    }
});
