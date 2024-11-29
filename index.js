
  // script.js

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('levelContainer').classList.remove('hidden');
    }, 2000); // Matches the animation duration
});

const levelContainer = document.getElementById('levelContainer');
const gameContainer = document.getElementById('gameContainer');
const gameGrid = document.getElementById('gameGrid');
const movesElement = document.getElementById('moves');
const timeElement = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');
const backBtn = document.getElementById('backBtn');

backBtn.addEventListener('click', () => {
  gameContainer.classList.add('hidden');
  levelContainer.classList.remove('hidden');
});

document.getElementById('easy').addEventListener('click', () => initGame('easy'));
document.getElementById('medium').addEventListener('click', () => initGame('medium'));
document.getElementById('hard').addEventListener('click', () => initGame('hard'));


let cardsArray = [
  { name: 'cat', img: './images/cat-with-knife.png' },
  { name: 'dog', img:'./images/cat-with-laptop.png'  },
  { name: 'fox', img:'./images/cat-with-fish.png'  },
  { name: 'rabbit', img:'./images/cat-slipper.png'  },
  { name: 'lion', img: './images/cat-with-duck.png'},
  { name: 'tiger', img: './images/cat-with-coolers.png' },
  { name: 'bear', img: './images/cat-with-notice.png' },
  { name: 'panda', img: './images/cat-scooter.png' },
  { name: 'kitty', img: './images/cat-with-water.png' },
  { name: 'panda', img: './images/cat-with-notice.png' },
  { name: 'panda', img: './images/cat-with-ball.png' },
  { name: 'panda', img: './images/cat-chef.png' },
];

let gridSize, cards, flippedCards, matchedCards, moveCount, timer, secondsElapsed;
const levels = {
  easy: { rows: 2, cols: 3 },
  medium: { rows: 4, cols: 3 },
  hard: { rows: 4, cols: 5 },
};

function initGame(level) {
  const { rows, cols } = levels[level];
  gridSize = rows * cols;
  cards = [...cardsArray.slice(0, gridSize / 2), ...cardsArray.slice(0, gridSize / 2)].sort(
    () => Math.random() - 0.5
  );

  flippedCards = [];
  matchedCards = 0;
  moveCount = 0;
  secondsElapsed = 0;

  movesElement.textContent = moveCount;
  timeElement.textContent = '0:00';
  clearInterval(timer);

  renderGrid(rows, cols);
  startTimer();

  levelContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
}

function renderGrid(rows, cols) {
  gameGrid.innerHTML = '';
  gameGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

  cards.forEach(({ name, img }) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.name = name;

    const cardImage = document.createElement('img');
    cardImage.src = img;
    card.appendChild(cardImage);

    card.addEventListener('click', flipCard);
    gameGrid.appendChild(card);
  });
}
let isFlipping = false; // Prevent rapid clicks

function flipCard() {
    // Prevent flipping if already flipping cards or this card is already flipped
    if (isFlipping || this.classList.contains('flipped') || this.classList.contains('matched')) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        isFlipping = true; // Block additional clicks during check
        checkForMatch();
    }
}


function checkForMatch() {
  const [card1, card2] = flippedCards;
  moveCount++;
  movesElement.textContent = moveCount;

  if (card1.dataset.name === card2.dataset.name) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedCards += 2;
      flippedCards = [];
      isFlipping = false; // Allow new interactions

      if (matchedCards === cards.length) {
          clearInterval(timer);
          alert(`You won in ${moveCount} moves and ${formatTime(secondsElapsed)}!`);
      }
  } else {
      setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
          isFlipping = false; // Allow new interactions
      }, 1000); // Match the flip-back animation duration
  }
}

function startTimer() {
  timer = setInterval(() => {
    secondsElapsed++;
    timeElement.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function resetGame() {
  // Find the current level based on the grid size
  const currentLevel = Object.keys(levels).find(
    (key) => levels[key].rows * levels[key].cols === gridSize
  );
  // Clear the interval
  clearInterval(timer);
  // Re-initialize the game with the current level
  initGame(currentLevel);
}

document.getElementById('easy').addEventListener('click', () => initGame('easy'));
document.getElementById('medium').addEventListener('click', () => initGame('medium'));
document.getElementById('hard').addEventListener('click', () => initGame('hard'));
restartBtn.addEventListener('click', resetGame);
