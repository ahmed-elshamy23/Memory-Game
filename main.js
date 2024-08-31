let nameContainer = document.getElementById("player-name");
let timerSpan = document.getElementById("timer");
let mistakesContainer = document.getElementById("mistakes");
let startScreen = document.querySelector(".start-screen");
let difficultyBox = document.getElementById("difficulty");
let startButton = document.querySelector("button");
let cards = document.querySelectorAll(".main .card");
let cardsArray = Array.from(cards);

let gameNotStarted = true;
let orderRange = [...Array(cards.length).keys()];
let totalFlips = 0;
let score = 100;
let mistakes = 0;
let gameTime = { minutes: 0, seconds: 0 };

// Initialization and cards shuffling
gameInit();

function gameInit() {
  startButton.onclick = function () {
    // Receiving player name and starting game
    let playerName = window.prompt("Enter your name: ");
    if (playerName === null || playerName === "") playerName = "Unknown";
    nameContainer.textContent += playerName;
    startScreen.remove();

    // Shuffling cards and flipping them for 1 second
    cardsArray.forEach((card) => {
      card.style.order =
        orderRange[Math.trunc(Math.random() * orderRange.length)];
    });
    cardsArray.forEach((card) => {
      card.classList.add("flipped");
    });
    setTimeout(() => {
      cardsArray.forEach((card) => {
        card.classList.remove("flipped");
      });
    }, 1000);

    // Setting timer
    if (difficultyBox.value === "Easy") gameTime.minutes = 3;
    else if (difficultyBox.value === "Medium") {
      gameTime.minutes = 1;
      gameTime.seconds = 30;
    } else gameTime.seconds = 30;
    let timer = setInterval(() => {
      timerSpan.textContent = `${String(gameTime.minutes).padStart(
        2,
        "0"
      )}:${String(gameTime.seconds).padStart(2, "0")}`;
      gameTime.seconds--;
      if (gameTime.seconds < 0) {
        gameTime.minutes--;
        gameTime.seconds = 59;
      }
      if (gameTime.minutes < 0) {
        timerSpan.classList.add("timeUp");
        window.alert("Time is up");
        score = 0;
        showResult();
        clearInterval(timer);
      } else if (totalFlips === cardsArray.length) clearInterval(timer);
    }, 1000);
  };

  // Attaching click event handler
  cardsArray.forEach((card) => {
    card.onclick = () => {
      flipCard(card);
    };
  });
}

function flipCard(card) {
  card.classList.add("flipped");
  let flippedCards = cardsArray.filter((card) =>
    card.classList.contains("flipped")
  );
  if (flippedCards.length === 1) {
    setTimeout(() => {
      if (flippedCards.length === 1) card.classList.remove("flipped");
    }, 700);
  } else if (flippedCards.length === 2) {
    disableClicking();
    checkForMatching(flippedCards[0], flippedCards[1]);
  }
}

function disableClicking() {
  cards[0].parentElement.classList.add("disabled");
  setTimeout(() => {
    cards[0].parentElement.classList.remove("disabled");
  }, 500);
}

function checkForMatching(card1, card2) {
  if (
    card1.lastElementChild.classList[0] === card2.lastElementChild.classList[0]
  ) {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.classList.add("done");
    card2.classList.add("done");
    totalFlips += 2;
    if (totalFlips === cardsArray.length) showResult();
    else document.getElementById("match-sound").play();
  } else {
    setTimeout(() => {
      document.getElementById("no-match-sound").play();
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      score -= 10;
      if (score < 0) score = 0;
      mistakes++;
      mistakesContainer.textContent = `Mistakes: ${mistakes}`;
    }, 500);
  }
}

function showResult() {
  let resultDiv = document.createElement("div");
  let subDiv = document.createElement("div");
  let scoreDiv = document.createElement("div");
  let mistakesDiv = document.createElement("div");
  let againButton = document.createElement("button");

  scoreDiv.classList.add("score");
  scoreDiv.appendChild(document.createElement("span"));
  scoreDiv.appendChild(document.createElement("span"));
  scoreDiv.firstElementChild.textContent = "Score: ";
  scoreDiv.lastElementChild.textContent = score;

  mistakesDiv.classList.add("mistakes");
  mistakesDiv.appendChild(document.createElement("span"));
  mistakesDiv.appendChild(document.createElement("span"));
  mistakesDiv.firstElementChild.textContent = "Mistakes: ";
  mistakesDiv.lastElementChild.textContent = mistakes;

  againButton.textContent = "Play Again";
  againButton.onclick = function () {
    window.location.reload();
  };

  subDiv.appendChild(scoreDiv);
  subDiv.appendChild(mistakesDiv);
  subDiv.appendChild(againButton);

  resultDiv.classList.add("result");
  resultDiv.appendChild(subDiv);

  document.body.appendChild(resultDiv);
  if (score < 50) document.getElementById("failure-sound").play();
  else document.getElementById("success-sound").play();
}
