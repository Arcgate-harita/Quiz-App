const container = document.querySelector('.container');
const nextBtn = document.querySelector('.nextBtn');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const header = document.querySelector('.header');
const scoreCard = document.querySelector('.scoreCard');
const alert = document.querySelector('.alert');



const quizArray = [
    {
        question: "What year was javascript launched?",
        options: ["1996", "1995", "1994", "none of the above"],
        answer: "1995",
    },
    {
        question: "What does HTML stand for?",
        options: ["Hypertext Markup Language", "Hypertext Markdown language", "Hyperloop Machine Language", "Helicopters Terminals Motorboats Lamborginins"],
        answer: "Hypertext Markup Language",
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "Javascript"],
        answer: "Javascript",
    },
    {
        question: "What does CSS stand for?",
        options: ["Central Style Sheets", "Cascading Style Sheets", "Cascading Simple Sheets", "Cars SUVs Sailboats"],
        answer: "Cascading Style Sheet",
    },
];

let currentQuestion = 0;
let score = 0;
let quizOver = false;

const showQuestion = () => {
    const details = quizArray[currentQuestion];
    questionBox.textContent = details.question;

    choicesBox.textContent = "";
    for (let i = 0; i < details.options.length; i++) {
        const currentOption = details.options[i];
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = currentOption;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => {
            // Remove 'selected' class from all options
            const selectedOptions = choicesBox.querySelectorAll('.selected');
            selectedOptions.forEach((option) => {
                option.classList.remove('selected');
            });

            // Add 'selected' class to the clicked option
            choiceDiv.classList.add('selected');
        });
    }
};


const check = () => {
    const selectedOption = document.querySelector('.choice.selected');
    if (selectedOption.textContent === quizArray[currentQuestion].answer) {
        score++;
    }
    else {
    }
    currentQuestion++;
    if (currentQuestion < quizArray.length) {
        showQuestion();
    }
    else {
        showScore();
    }
}

const showScore = () => {
    questionBox.textContent = "";
    choicesBox.textContent = "";
    scoreCard.textContent = `you scored  ${score} out of ${quizArray.length}!`;
    alertDisplay("You have completed your Quiz.");
    nextBtn.textContent = "Reload";
    quizOver = true;

}

const alertDisplay = (message) => {
    alert.style.display = "block";
    alert.textContent = message;
    setTimeout(() => {
        alert.style.display = "none";
    }, 2000);
}
showQuestion();

const shuffleQuestions = () => {
    quizArray.sort(() => Math.random() - 0.5);
    currentQuestion = 0;
    showQuestion();
};


nextBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('.choice.selected');
    if (!selectedOption && nextBtn.textContent === "Next") {
        alertDisplay("Select your answer");
        return;
    }

    if (quizOver) {
        // currentQuestion = 0;
        nextBtn.textContent = "Next";
        scoreCard.textContent = "";
        currentQuestion = 0;
        showQuestion();
        shuffleQuestions();
        quizOver = false;
        score = 0;
    }
    else {
        check();
    }

});