// Bu JavaScript kodlari quiz o'yini funktsiyalarni o'z ichiga oladi va o'yin oynayotganini boshlaydi.
const startButton = document.getElementById("startBtn");
const quizContainer = document.getElementById("quizContainer");
const questionContainer = document.getElementById("questionContainer");
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const nextButton = document.getElementById("nextBtn");
const resultElement = document.getElementById("result");
const playAgainButton = document.getElementById("playAgainBtn");
const optionButtons = document.querySelectorAll('input[name="capitalOption"]');
const timercha = document.querySelector(".timer");
const question_title = document.querySelector('.question_title');
const music = new Audio('/assets/music.mp3');
let currentQuestionIndex = 0;
let score = 0;
let correctCapital = "";
let timer;
let correctAnswers = 0;
let wrongAnswers = 0;

// startButton bosilganda o'yin boshlanadi
startButton.addEventListener("click", startQuiz);

// nextButton bosilganda keyingi savol ko'rsatiladi
nextButton.addEventListener("click", displayNextQuestion);

// playAgainButton bosilganda o'yin qayta boshlanadi
playAgainButton.addEventListener("click", restartGame);

// startQuiz funktsiyasi o'yinni boshlaydi
function startQuiz() {
  quizContainer.style.display = "none";
  questionContainer.style.display = "block";
  displayQuestion();
}

// startQuiz funktsiyasi o'yinni boshlaydi
async function fetchRandomCountry() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const countries = await response.json();
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

// startTimer funktsiyasi vaqt chiziqini boshlaydi
function startTimer() {
  let timeLeft = 15;
  timer = setInterval(function () {
    if (timeLeft >= 0) {
      timercha.textContent = `Time left: ${timeLeft--} seconds`;
    } else {
      clearInterval(timer);
      displayNextQuestion();
    }
  }, 1000);
}

// tanlangan javoblar sahifasini tozalash uchun clearOptions funktsiyasi
function clearOptions() {
  optionsContainer.innerHTML = "";
}

// variantlar ro'yxatini chiqarish uchun renderOptions funktsiyasi
function renderOptions(capitals) {
  capitals.forEach(capital => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "capitalOption";
    radio.value = capital;
    radio.style.cursor = "pointer"
    radio.style.accentColor = "#e74c3c"
    optionsContainer.appendChild(radio);

    const label = document.createElement("label");
    label.textContent = capital;
    optionsContainer.appendChild(label);
  });
}

// Keyingi savolni ko'rsatish uchun nextButton ni yoqish
function enableNextButton() {
  nextButton.disabled = false;
}

// Savolni chiqarish va tanlangan variantlarni tayyorlash uchun displayQuestion funktsiyasi
async function displayQuestion() {
  clearInterval(timer);
  startTimer();
  music.play();
  question_title.innerHTML = "Find the Capital";

  const countryData = await fetchRandomCountry();
  correctCapital = countryData.capital[0];

  const otherCapitals = [];
  while (otherCapitals.length < 3) {
    const randomCountry = await fetchRandomCountry();
    const randomCapital = randomCountry.capital[0];
    if (randomCapital !== correctCapital && !otherCapitals.includes(randomCapital)) {
      otherCapitals.push(randomCapital);
    }
  }

  const allCapitals = [correctCapital, ...otherCapitals].sort(() => Math.random() - 0.5);

  questionElement.textContent = `What is the capital of ${countryData.name.common}?`;
  clearOptions();
  renderOptions(allCapitals);

  nextButton.disabled = true;
  playAgainButton.classList.add("hidden");
  resultElement.textContent = "";
}

// Natijalarni hisoblash uchun calculateResults funktsiyasi
function calculateResults() {
  music.pause();
  DontViewElements();
  question_title.innerHTML = "Your Results!";
  resultElement.textContent = `Your score: ${score}`;
  resultElement.textContent += ` | Correct answers: ${correctAnswers}`;
  resultElement.textContent += ` | Wrong answers: ${wrongAnswers}`;

  if (score >= 7) {
    resultElement.innerHTML += `<h3> Your level is genius! </h3>`;
  } else if (score >= 5) {
    resultElement.innerHTML += `<h3> Your level is medium! </h3>`;
  } else {
    resultElement.innerHTML += `<h3> You can do better! </h3>`;
  }
  resultElement.classList.remove("hidden");

  playAgainButton.classList.remove("hidden");
}

// Keyingi savolni ko'rsatish uchun displayNextQuestion funktsiyasi
function displayNextQuestion() {
    clearInterval(timer);
  
    const selectedOption = document.querySelector('input[name="capitalOption"]:checked');
    if (selectedOption) {
      if (selectedOption.value === correctCapital) {
        score++;
        correctAnswers++;
        document.body.classList.add("correct-answer");
      } else {
        wrongAnswers++;
        document.body.classList.add("wrong-answer");
      }
    } else {
      wrongAnswers++;
      document.body.classList.add("wrong-answer");

    }
  
    setTimeout(() => {
      document.body.classList.remove("correct-answer", "wrong-answer");
      currentQuestionIndex++;
      if (currentQuestionIndex < 10) {
        displayQuestion();
      } else {
        calculateResults();
      }
    }, 1000);
  }
  
// O'yinni boshidan boshlash
function restartGame() {
  currentQuestionIndex = 0;
  score = 0;
  correctAnswers = 0;
  wrongAnswers = 0;
  playAgainButton.classList.add("hidden");
  ViewElements();
  displayQuestion();
}
// O'yin elementlarini o'zgartirish
optionsContainer.addEventListener("change", enableNextButton);

// O'yin boshlanganida o'yin konteynerini ko'rsatish
quizContainer.style.display = "block";
questionContainer.style.display = "none";

// O'yin elementlarini ko'rsatish va ko'rsatmaslik uchun funksiya
function ViewElements(){
  nextButton.style.display = "flex";
  optionsContainer.style.display = "grid";
  questionElement.style.display = "block";
  timercha.style.display = "block";
}

// O'yin elementlarini ko'rsatmaslik uchun funksiyalar
function DontViewElements(){
  nextButton.style.display = "none";
  optionsContainer.style.display = "none";
  questionElement.style.display = "none";
  timercha.style.display = "none";
}
