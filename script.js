// Little Cozy RPS — all game logic lives here.
const choices = ["rock", "paper", "scissors"];
const emoji = { rock: "🪨", paper: "📜", scissors: "✂️" };

let playerScore = 0;
let computerScore = 0;
let round = 1;
let soundOn = false;

const playerScoreEl = document.getElementById("playerScore");
const computerScoreEl = document.getElementById("computerScore");
const roundCountEl = document.getElementById("roundCount");
const playerChoiceEl = document.getElementById("playerChoice");
const computerChoiceEl = document.getElementById("computerChoice");
const statusTitle = document.getElementById("statusTitle");
const statusText = document.getElementById("statusText");
const resultPill = document.getElementById("resultPill");
const soundToggle = document.getElementById("soundToggle");

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function getResult(player, computer) {
  if (player === computer) return "draw";
  const playerWins =
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper");
  return playerWins ? "win" : "lose";
}

function playRound(player) {
  const computer = getComputerChoice();
  const result = getResult(player, computer);

  playerChoiceEl.textContent = emoji[player];
  computerChoiceEl.textContent = emoji[computer];

  if (result === "win") {
    playerScore++;
    statusTitle.textContent = "You got it! ✨";
    statusText.textContent = `${capitalize(player)} beats ${computer}. Lovely move!`;
    resultPill.textContent = "You win this round!";
  } else if (result === "lose") {
    computerScore++;
    statusTitle.textContent = "A tiny plot twist!";
    statusText.textContent = `${capitalize(computer)} beats ${player}. Try again?`;
    resultPill.textContent = "Cozy Bot wins this round";
  } else {
    statusTitle.textContent = "A perfect little tie!";
    statusText.textContent = "Great minds choose alike.";
    resultPill.textContent = "It's a draw!";
  }

  resultPill.className = `result-pill ${result}`;
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  round++;
  roundCountEl.textContent = round;

  if (soundOn) playTone(result);
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// A tiny synthesized tone; no audio files or external libraries needed.
function playTone(result) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const frequencies = { win: 660, lose: 220, draw: 440 };
  oscillator.frequency.value = frequencies[result];
  oscillator.type = "sine";
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.23);
  oscillator.onended = () => context.close();
}

document.querySelectorAll(".choice-btn").forEach((button) => {
  button.addEventListener("click", () => playRound(button.dataset.choice));
});

document.getElementById("resetBtn").addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  round = 1;
  playerScoreEl.textContent = "0";
  computerScoreEl.textContent = "0";
  roundCountEl.textContent = "1";
  playerChoiceEl.textContent = "?";
  computerChoiceEl.textContent = "?";
  statusTitle.textContent = "Ready when you are!";
  statusText.textContent = "Choose your hand to start the game.";
  resultPill.textContent = "Your turn ✨";
  resultPill.className = "result-pill";
});

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.textContent = soundOn ? "♫ Sound: On" : "♫ Sound: Off";
  soundToggle.setAttribute("aria-pressed", String(soundOn));
});
