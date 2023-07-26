const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const alert = document.querySelector('.alert');
const startScreen = document.getElementById('start-screen');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const startQuizButton = document.getElementById('start-quiz-button');
const errorMessage = document.getElementById('error-message');
const quizScreen = document.getElementById('quiz-screen');
const usernameDisplay = document.getElementById('username-display');
const backBtn = document.querySelector('.backBtn');
const nextBtn = document.querySelector('.nextBtn');
const reloadBtn = document.getElementById('reloadBtn');
const scoreCard = document.getElementById('scoreCard');
const scoreText = document.getElementById('scoreText');

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
    answer: "Cascading Style Sheets",
  },
];

let currentQuestion = 0;
let score = 0;
let quizOver = false; 0

let storedScore = localStorage.getItem('score');
if (storedScore !== null) {
  score = parseInt(storedScore);
}

let storedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex');
if (storedCurrentQuestionIndex !== null) {
  currentQuestion = parseInt(storedCurrentQuestionIndex);
}

let storedSelectedOptions = localStorage.getItem('selectedOptions');
let selectedOptionsArray = storedSelectedOptions ? JSON.parse(storedSelectedOptions) : [];


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


    // Check if there is a stored selected option for this question
    if (selectedOptionsArray[currentQuestion] !== undefined && selectedOptionsArray[currentQuestion] === i) {
      choiceDiv.classList.add('selected');
    }

    choiceDiv.addEventListener('click', () => {
      // Remove 'selected' class from all options
      const selectedOptions = choicesBox.querySelectorAll('.selected');
      //one option is selected at time 
      selectedOptions.forEach((option) => {
        option.classList.remove('selected');
      });
      // Add 'selected' class to the clicked option
      choiceDiv.classList.add('selected');
      //details.selectedOptionIndex = i;

      // Store the selected option index in the selectedOptionsArray
      selectedOptionsArray[currentQuestion] = i;
      localStorage.setItem('selectedOptions', JSON.stringify(selectedOptionsArray));

    });
    reloadBtn.style.display = 'none';
  }
  // Store the current question index in localStorage
  localStorage.setItem('currentQuestionIndex', currentQuestion);
};


nextBtn.addEventListener('click', () => {
  const selectedOption = document.querySelector('.choice.selected');
  if (!selectedOption && nextBtn.textContent === "Next") {
    alertDisplay("Select your answer");
    return;
  }
  if (quizOver) {
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

//back button 
const showPreviousQuestion = () => {
  currentQuestion--;
  showQuestion();
  // Store the current question index in localStorage
  localStorage.setItem('currentQuestionIndex', currentQuestion);
};

backBtn.addEventListener('click', () => {
  showPreviousQuestion();
});


const showScore = () => {
  questionBox.textContent = "";
  choicesBox.textContent = "";
  reloadBtn.style.display = 'block';
  scoreCard.style.display = 'block';
  scoreText.textContent = `you scored  ${score} out of ${quizArray.length}!`;
  alertDisplay("You have completed your Quiz.");
  nextBtn.style.display = 'none';
  backBtn.style.display = 'none';
  quizOver = true;
  // Add the user's data to the user data array
  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');
  userDataArray(username, email, score);
  displayUserData();
  // Store the current page state as 'scoreCard'
  storePageState('scoreCard');
  // Store the score in localStorage
  localStorage.setItem('score', score);
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



// Function to start the quiz
const startQuiz = () => {
  // Hide login screen and show quiz screen
  startScreen.style.display = 'none';
  quizScreen.style.display = 'block';

  selectedOptionsArray = [];
  localStorage.removeItem('selectedOptions');

  // Display username on the quiz screen
  const usernames = localStorage.getItem('username');
  usernameDisplay.textContent = `Username: ${usernames}`;

  //const storedCurrentQuestionIndex = localStorage.getItem('currentQuestionIndex');
  localStorage.getItem('currentQuestionIndex');
  // Reset quiz state and clear the score
  currentQuestion = 0;
  score = 0;
  quizOver = false;
  scoreText.textContent = '';
  showQuestion();

  // Store the current page state as 'quizScreen'
  storePageState('quizScreen');

  // Store the username in localStorage
  const username = localStorage.getItem('username');
  localStorage.setItem('username', usernameInput.value.trim());

};

startQuizButton.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();

  // Validate username and email
  const validationError = validateLogin(username, email);

  if (validationError) {
    // Display error message
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = validationError;
    return;
  }

  // Save username and email to local storage
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);

  //display username on quiz screen
  usernameDisplay.textContent = `Username: ${username}`;
  usernameDisplay.style.display = 'block';

  const storedUserData = localStorage.getItem('userData');
  let usersArray = storedUserData ? JSON.parse(storedUserData) : [];

  // Check if 10 users have completed the quiz
  if (usersArray.length >= 11) {
    location.reload(); // Reload the page to show the login/start screen again
    return;
  }
  //startQuiz();


  // Check if the user has completed the quiz before
  const previousUser = usersArray.find((user) => user.email === email);

  if (previousUser) {
    // Show the result page with the previous score
    score = previousUser.score;
    showScore();
  } else {
    // Start the quiz for a new user
    startQuiz();
  }



});


// Function to validate username and email
const validateLogin = (username, email) => {
  const usernameRegex = /^[a-zA-Z0-9_]{8,10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!usernameRegex.test(username)) {
    return 'Invalid username. Username must be at least 8-10 characters long and can contain letters, numbers, and underscores.';
  }

  if (!emailRegex.test(email)) {
    return 'Invalid email address. Please enter a valid email address.';
  } else {
    startQuiz();
  }
};

//Function to handle the unload event
const handleUnload = () => {
  // Show the login screen again when the page is being unloaded
  startScreen.style.display = 'block';
  quizScreen.style.display = 'none';
};

// Add an event listener to the unload event on the window object
window.addEventListener('unload', handleUnload);


// Function to hide the table on the start screen and clear the table content
const hideUserDataTable = () => {
  showUserDataTable(false);
  const userDataTableBody = document.querySelector('#userDataTable tbody');
  userDataTableBody.innerHTML = '';
};


const showUserDataTable = (visible) => {
  const userDataTable = document.getElementById('userDataTable');
  if (visible) {
    userDataTable.style.display = 'table';
  } else {
    userDataTable.style.display = 'none';
  }
};


// Function to display user data
const displayUserData = () => {
  const userData = getUserData();
  const userDataTableBody = document.querySelector('#userDataTable tbody');
  userDataTableBody.innerHTML = ''; // Clear the table body before adding new data

  userData.forEach((user) => {
    const row = userDataTableBody.insertRow();
    row.insertCell().textContent = user.username;
    row.insertCell().textContent = user.email;
    row.insertCell().textContent = user.score;
  });
  showUserDataTable(true);
};


// Function to get the user data from local storage
const getUserData = () => {
  const userDataJSON = localStorage.getItem('userData');
  return userDataJSON ? JSON.parse(userDataJSON) : [];
};


// Function to add user data to the user data array
const userDataArray = (username, email, score) => {
  const userData = getUserData();

  // Check if user data already exists for the given username and email
  const existingUser = userData.find(user => user.username === username && user.email === email);

  if (existingUser) {
    // Update existing user's score
    existingUser.score = score;
  } else {
    // Add a new user with username, email, and score
    userData.push({ username, email, score });
  }
  saveUserData(userData);
};

// Function to save user data to local storage
const saveUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};


// Function to handle the reload event
const reloadQuiz = () => {
  // Save the username and email to localStorage
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  localStorage.setItem('username', username);
  localStorage.setItem('email', email);
  // Reload the page
  location.reload();
  // Hide the score screen
  scoreCard.style.display = 'none';
  // Show the start screen
  startScreen.style.display = 'block';
  usernameDisplay.style.display = 'none';
  hideUserDataTable();
  // Clear the username and email input fields
  usernameInput.value = '';
  emailInput.value = '';
  // Clear the stored page state to go back to the login screen
  localStorage.removeItem('currentPage');

};

// Check if 10 users have completed the quiz
const storedUserData = localStorage.getItem('userData');
let usersArray = storedUserData ? JSON.parse(storedUserData) : [];

if (usersArray.length >= 10) {
  // Clear quiz-related data and reset quiz state
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('selectedOptions');
  localStorage.removeItem('score');


  if (usersArray.length >= 10) {
    // Reload the page if there are more than 10 users
    location.reload();


  } else {
    // Hide the score screen
    scoreCard.style.display = 'none';
    // Show the start screen and hide the table on the start screen
    startScreen.style.display = 'block';
    usernameDisplay.style.display = 'none';
    hideUserDataTable();
    // Clear the username and email input fields
    usernameInput.value = '';
    emailInput.value = '';
  }


  // Reset quiz state and clear the score
  currentQuestion = 0;
  score = 0;
  quizOver = false;
  scoreText.textContent = '';
  hideUserDataTable();
  displayUserData();
  // Clear user data from local storage
  localStorage.removeItem('userData');
};

// Check if the 10th user has completed the quiz
if (usersArray.length >= 11) {
  // Show the result table
  displayUserData();
}

reloadBtn.addEventListener('click', reloadQuiz);


// Function to start the quiz or show the result page with the previous score
const startQuizOrShowScore = () => {
  // Retrieve user's previous score if available
  const storedUserData = localStorage.getItem('userData');
  let usersArray = storedUserData ? JSON.parse(storedUserData) : [];
  const email = localStorage.getItem('email');
  const previousUser = usersArray.find((user) => user.email === email);

  // If the user has completed the quiz before, show their previous score
  if (previousUser) {
    userCompletedQuiz = true;
    score = previousUser.score;
    showScore(); // Display the result page with the previous score
    return;
  }

  // Otherwise, start the quiz for a new user
  startQuiz();
};

const storePageState = (pageName) => {
  localStorage.setItem('currentPage', pageName);
};

// Retrieve the stored page state from localStorage
const storedPage = localStorage.getItem('currentPage');

// Display the appropriate page based on the stored page state
if (storedPage === 'quizScreen') {
  startScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  showQuestion();
} else if (storedPage === 'scoreCard') {
  startScreen.style.display = 'none';
  quizScreen.style.display = 'block';
  showScore();
} else {
  // If no page state is stored or the stored state is not recognized, display the start screen
  startScreen.style.display = 'block';
  quizScreen.style.display = 'none';
}


// Retrieve the stored username from localStorage
const storedUsername = localStorage.getItem('username');

// Display the username on the quiz screen
if (storedUsername) {
  usernameDisplay.textContent = `Username: ${storedUsername}`;
  usernameDisplay.style.display = 'block';
}

