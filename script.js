const flipCard      = document.getElementById('flip-card');
const resultBox     = document.getElementById('result-box');
const resultText    = document.getElementById('result-text');
const winCountEl    = document.getElementById('win-count');
const lossCountEl   = document.getElementById('loss-count');
const drawCountEl   = document.getElementById('draw-count');   // NEW

/* ---------- game state ---------- */
const moves   = ['rock', 'paper', 'scissors'];
const iconMap = {
  rock:     '<i class="far fa-hand-rock"    style="color:#274c77;"></i>',
  paper:    '<i class="far fa-hand-paper"   style="color:#274c77;"></i>',
  scissors: '<i class="far fa-hand-scissors"style="color:#274c77;"></i>',
};
const maxRounds = 10;

let roundsPlayed = 0;
let wins   = 0;
let losses = 0;
let draws  = 0;          // NEW

/* ---------- helpers ---------- */
function compare(p, s) {
  if (p === s) return 0;
  return (p === 'rock' && s === 'scissors') ||
         (p === 'paper' && s === 'rock')   ||
         (p === 'scissors' && s === 'paper') ? 1 : -1;
}

function disableMoveButtons(disabled) {
  document.querySelectorAll('button[data-move]')
          .forEach(btn => btn.disabled = disabled);
}

/* ---------- main game ---------- */
function play(playerMove) {
  if (roundsPlayed >= maxRounds) return;

  const systemMove = moves[Math.floor(Math.random() * 3)];
  const outcome    = compare(playerMove, systemMove);
  roundsPlayed++;

  if (outcome === 1)       wins++;
  else if (outcome === -1) losses++;
  else                     draws++;          // NEW

  updateUI(playerMove, systemMove, outcome);

  if (roundsPlayed === maxRounds) {
    disableMoveButtons(true);
    setTimeout(showDashboard, 1000);
  }
}

/* ---------- UI updates ---------- */
function updateUI(playerMove, systemMove, outcome) {
  resultBox.innerHTML = `
    <div class="move-block">
      <span>You</span>
      ${iconMap[playerMove]}
    </div>
    <div class="move-block">
      <span>System</span>
      ${iconMap[systemMove]}
    </div>
  `;

  resultBox.classList.remove('win', 'bloom', 'loss');
  void resultBox.offsetWidth; // restart animation

  if (outcome === 1) {
    resultText.innerHTML = '<span style="color:green;">YOU&nbsp;WIN!</span>';
    resultBox.classList.add('win');
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
  } else if (outcome === 0) {
    resultText.innerHTML = '<span style="color:#e69500;">MATCH&nbsp;DRAW!</span>';
    resultBox.classList.add('bloom');
  } else {
    resultText.innerHTML = '<span style="color:red;">YOU&nbsp;LOSE!</span>';
    resultBox.classList.add('loss');
  }
}

function showDashboard() {
  winCountEl.textContent  = `Wins:   ${wins}`;
  lossCountEl.textContent = `Losses: ${losses}`;
  drawCountEl.textContent = `Draws:  ${draws}`;   // NEW
  flipCard.classList.add('flipped');
}

function resetGame() {
  roundsPlayed = wins = losses = draws = 0;       // NEW
  resultBox.innerHTML = '';
  resultText.innerHTML = '';
  flipCard.classList.remove('flipped');
  disableMoveButtons(false);
}

/* ---------- event listeners ---------- */
document.querySelectorAll('button[data-move]')
        .forEach(btn => btn.addEventListener('click', () => play(btn.dataset.move)));

document.getElementById('replay-btn')     .addEventListener('click', resetGame);
document.getElementById('play-again-btn') .addEventListener('click', resetGame);