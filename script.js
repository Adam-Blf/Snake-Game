/**
 * Snake Game
 * Author: Adam Beloucif
 * Description: Jeu Snake classique avec niveaux, scores et paramètres personnalisables
 */

// ===================================================
// CANVAS SETUP
// ===================================================
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

// ===================================================
// GAME STATE
// ===================================================
let isGameRunning = false;
let isPaused = false;
let gameLoop = null;
let score = 0;
let level = 1;
let highScore = localStorage.getItem('snakeHighScore') || 0;

// Settings
let settings = {
    difficulty: 'medium',
    gridSize: 20,
    wallsEnabled: true,
    soundEnabled: true,
    keyboardLayout: 'azerty'
};

// Speed configurations (ms per frame)
const speedConfig = {
    easy: 150,
    medium: 100,
    hard: 60,
    extreme: 40
};

// Game variables
let gridSize = 20;
let tileSize = 0;
let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let food = { x: 0, y: 0 };
let obstacles = [];
let gameSpeed = 100;

// ===================================================
// DOM ELEMENTS
// ===================================================
const elements = {
    mainMenu: document.getElementById('mainMenu'),
    settingsPanel: document.getElementById('settingsPanel'),
    leaderboardPanel: document.getElementById('leaderboardPanel'),
    gameScreen: document.getElementById('gameScreen'),
    pauseMenu: document.getElementById('pauseMenu'),
    gameOverModal: document.getElementById('gameOverModal'),
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    level: document.getElementById('level'),
    pauseScore: document.getElementById('pauseScore'),
    finalScore: document.getElementById('finalScore'),
    finalLevel: document.getElementById('finalLevel'),
    finalLength: document.getElementById('finalLength'),
    highScoreMsg: document.getElementById('highScoreMsg'),
    leaderboardList: document.getElementById('leaderboardList'),
    difficulty: document.getElementById('difficulty'),
    gridSize: document.getElementById('gridSize'),
    wallsEnabled: document.getElementById('wallsEnabled'),
    soundEnabled: document.getElementById('soundEnabled'),
    keyboardLayout: document.getElementById('keyboardLayout')
};

// ===================================================
// GAME INITIALIZATION
// ===================================================
function initGame() {
    isGameRunning = true;
    isPaused = false;
    score = 0;
    level = 1;
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    obstacles = [];
    
    // Setup grid
    gridSize = settings.gridSize;
    tileSize = canvas.width / gridSize;
    gameSpeed = speedConfig[settings.difficulty];
    
    // Initialize snake in the center
    const centerX = Math.floor(gridSize / 2);
    const centerY = Math.floor(gridSize / 2);
    snake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY }
    ];
    
    // Place first food
    placeFood();
    
    // Update UI
    updateUI();
    elements.highScore.textContent = highScore;
    
    // Show game screen
    hideAllScreens();
    elements.gameScreen.classList.remove('hidden');
    
    // Start game loop
    startGameLoop();
}

function startGameLoop() {
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(() => {
        if (!isPaused && isGameRunning) {
            update();
            render();
        }
    }, gameSpeed);
}

// ===================================================
// GAME LOGIC
// ===================================================
function update() {
    // Update direction
    direction = { ...nextDirection };
    
    // Calculate new head position
    const head = { ...snake[0] };
    head.x += direction.x;
    head.y += direction.y;
    
    // Check walls
    if (settings.wallsEnabled) {
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameOver();
            return;
        }
    } else {
        // Wrap around
        if (head.x < 0) head.x = gridSize - 1;
        if (head.x >= gridSize) head.x = 0;
        if (head.y < 0) head.y = gridSize - 1;
        if (head.y >= gridSize) head.y = 0;
    }
    
    // Check self collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }
    
    // Check obstacle collision
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
        gameOver();
        return;
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        score += 10 * level;
        updateUI();
        placeFood();
        playSound('eat');
        
        // Level up every 5 foods
        if (score % 50 === 0) {
            levelUp();
        }
        
        // Add obstacles at higher levels
        if (level > 2 && Math.random() < 0.3) {
            addObstacle();
        }
    } else {
        // Remove tail
        snake.pop();
    }
}

function placeFood() {
    let validPosition = false;
    
    while (!validPosition) {
        food.x = Math.floor(Math.random() * gridSize);
        food.y = Math.floor(Math.random() * gridSize);
        
        // Check if position is valid (not on snake or obstacles)
        validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y) &&
                       !obstacles.some(obs => obs.x === food.x && obs.y === food.y);
    }
}

function addObstacle() {
    let validPosition = false;
    let obstacle = { x: 0, y: 0 };
    
    while (!validPosition) {
        obstacle.x = Math.floor(Math.random() * gridSize);
        obstacle.y = Math.floor(Math.random() * gridSize);
        
        validPosition = !snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) &&
                       obstacle.x !== food.x && obstacle.y !== food.y &&
                       !obstacles.some(obs => obs.x === obstacle.x && obs.y === obstacle.y);
    }
    
    obstacles.push(obstacle);
}

function levelUp() {
    level++;
    updateUI();
    playSound('levelup');
    
    // Increase speed
    gameSpeed = Math.max(40, gameSpeed - 10);
    startGameLoop();
}

// ===================================================
// RENDERING
// ===================================================
function render() {
    // Clear canvas
    ctx.fillStyle = '#0f1419';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tileSize, 0);
        ctx.lineTo(i * tileSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * tileSize);
        ctx.lineTo(canvas.width, i * tileSize);
        ctx.stroke();
    }
    
    // Draw food
    const foodGradient = ctx.createRadialGradient(
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        0,
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        tileSize / 2
    );
    foodGradient.addColorStop(0, '#ef4444');
    foodGradient.addColorStop(1, '#dc2626');
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
        food.x * tileSize + tileSize / 2,
        food.y * tileSize + tileSize / 2,
        tileSize / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw obstacles
    ctx.fillStyle = '#475569';
    obstacles.forEach(obs => {
        ctx.fillRect(
            obs.x * tileSize + 1,
            obs.y * tileSize + 1,
            tileSize - 2,
            tileSize - 2
        );
    });
    
    // Draw snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Head
            const headGradient = ctx.createLinearGradient(
                segment.x * tileSize,
                segment.y * tileSize,
                segment.x * tileSize + tileSize,
                segment.y * tileSize + tileSize
            );
            headGradient.addColorStop(0, '#10b981');
            headGradient.addColorStop(1, '#059669');
            ctx.fillStyle = headGradient;
        } else {
            // Body
            const opacity = 1 - (index / snake.length) * 0.5;
            ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
        }
        
        ctx.fillRect(
            segment.x * tileSize + 1,
            segment.y * tileSize + 1,
            tileSize - 2,
            tileSize - 2
        );
        
        // Draw eyes on head
        if (index === 0) {
            ctx.fillStyle = '#ffffff';
            const eyeSize = tileSize / 6;
            const eyeOffset = tileSize / 4;
            
            if (direction.x !== 0) {
                // Horizontal movement
                ctx.fillRect(
                    segment.x * tileSize + (direction.x > 0 ? tileSize - eyeOffset : eyeOffset - eyeSize),
                    segment.y * tileSize + eyeOffset,
                    eyeSize,
                    eyeSize
                );
                ctx.fillRect(
                    segment.x * tileSize + (direction.x > 0 ? tileSize - eyeOffset : eyeOffset - eyeSize),
                    segment.y * tileSize + tileSize - eyeOffset,
                    eyeSize,
                    eyeSize
                );
            } else {
                // Vertical movement
                ctx.fillRect(
                    segment.x * tileSize + eyeOffset,
                    segment.y * tileSize + (direction.y > 0 ? tileSize - eyeOffset : eyeOffset - eyeSize),
                    eyeSize,
                    eyeSize
                );
                ctx.fillRect(
                    segment.x * tileSize + tileSize - eyeOffset,
                    segment.y * tileSize + (direction.y > 0 ? tileSize - eyeOffset : eyeOffset - eyeSize),
                    eyeSize,
                    eyeSize
                );
            }
        }
    });
}

// ===================================================
// GAME MANAGEMENT
// ===================================================
function updateUI() {
    elements.score.textContent = score;
    elements.level.textContent = level;
    elements.pauseScore.textContent = score;
}

function pauseGame() {
    isPaused = true;
    elements.pauseMenu.classList.remove('hidden');
}

function resumeGame() {
    isPaused = false;
    elements.pauseMenu.classList.add('hidden');
}

function gameOver() {
    isGameRunning = false;
    clearInterval(gameLoop);
    playSound('gameover');
    
    // Update high score
    let isNewHighScore = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        isNewHighScore = true;
    }
    
    // Save to leaderboard
    saveScore(score, level, snake.length);
    
    // Show game over modal
    elements.finalScore.textContent = score;
    elements.finalLevel.textContent = level;
    elements.finalLength.textContent = snake.length;
    elements.highScoreMsg.textContent = isNewHighScore ? '🎉 Nouveau record !' : '';
    elements.gameOverModal.classList.remove('hidden');
}

function quitGame() {
    isGameRunning = false;
    isPaused = false;
    clearInterval(gameLoop);
    hideAllScreens();
    elements.mainMenu.classList.remove('hidden');
}

function hideAllScreens() {
    elements.mainMenu.classList.add('hidden');
    elements.settingsPanel.classList.add('hidden');
    elements.leaderboardPanel.classList.add('hidden');
    elements.gameScreen.classList.add('hidden');
    elements.pauseMenu.classList.add('hidden');
    elements.gameOverModal.classList.add('hidden');
}

// ===================================================
// CONTROLS
// ===================================================
function changeDirection(newDirection) {
    // Prevent reversing
    if (newDirection.x === -direction.x && newDirection.y === -direction.y) {
        return;
    }
    
    // Prevent diagonal movement
    if (newDirection.x !== 0 && newDirection.y !== 0) {
        return;
    }
    
    nextDirection = newDirection;
}

// ===================================================
// LEADERBOARD
// ===================================================
function saveScore(score, level, length) {
    let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    
    leaderboard.push({
        score: score,
        level: level,
        length: length,
        date: new Date().toLocaleDateString(),
        difficulty: settings.difficulty
    });
    
    // Sort by score and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
    
    if (leaderboard.length === 0) {
        elements.leaderboardList.innerHTML = '<p class="empty-leaderboard">Aucun score enregistré</p>';
        return;
    }
    
    elements.leaderboardList.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'leaderboard-entry';
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        entryDiv.innerHTML = `
            <span class="entry-rank">${medal}</span>
            <div class="entry-details">
                <span class="entry-score">${entry.score} pts</span>
                <span class="entry-info">Niveau ${entry.level} • Longueur ${entry.length} • ${entry.difficulty}</span>
                <span class="entry-date">${entry.date}</span>
            </div>
        `;
        
        elements.leaderboardList.appendChild(entryDiv);
    });
}

function clearLeaderboard() {
    if (confirm('Voulez-vous vraiment effacer tous les scores ?')) {
        localStorage.removeItem('snakeLeaderboard');
        localStorage.removeItem('snakeHighScore');
        highScore = 0;
        displayLeaderboard();
    }
}

// ===================================================
// SOUND EFFECTS
// ===================================================
function playSound(type) {
    if (!settings.soundEnabled) return;
    
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch (type) {
        case 'eat':
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'levelup':
            oscillator.frequency.value = 600;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'gameover':
            oscillator.frequency.value = 200;
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            break;
    }
}

// ===================================================
// EVENT LISTENERS
// ===================================================
// Menu buttons
document.getElementById('playBtn').addEventListener('click', initGame);

document.getElementById('settingsBtn').addEventListener('click', () => {
    hideAllScreens();
    elements.settingsPanel.classList.remove('hidden');
});

document.getElementById('leaderboardBtn').addEventListener('click', () => {
    hideAllScreens();
    displayLeaderboard();
    elements.leaderboardPanel.classList.remove('hidden');
});

document.getElementById('backToMenuBtn').addEventListener('click', () => {
    hideAllScreens();
    elements.mainMenu.classList.remove('hidden');
});

document.getElementById('backToMenuBtn2').addEventListener('click', () => {
    hideAllScreens();
    elements.mainMenu.classList.remove('hidden');
});

document.getElementById('clearScoresBtn').addEventListener('click', clearLeaderboard);

// Game controls
document.getElementById('pauseBtn').addEventListener('click', pauseGame);
document.getElementById('restartBtn').addEventListener('click', initGame);
document.getElementById('quitBtn').addEventListener('click', quitGame);

// Pause menu
document.getElementById('resumeBtn').addEventListener('click', resumeGame);
document.getElementById('restartBtn2').addEventListener('click', () => {
    elements.pauseMenu.classList.add('hidden');
    initGame();
});
document.getElementById('mainMenuBtn').addEventListener('click', quitGame);

// Game over modal
document.getElementById('playAgainBtn').addEventListener('click', () => {
    elements.gameOverModal.classList.add('hidden');
    initGame();
});
document.getElementById('menuBtn').addEventListener('click', () => {
    elements.gameOverModal.classList.add('hidden');
    quitGame();
});

// Settings
elements.difficulty.addEventListener('change', (e) => {
    settings.difficulty = e.target.value;
});

elements.gridSize.addEventListener('change', (e) => {
    settings.gridSize = parseInt(e.target.value);
});

elements.wallsEnabled.addEventListener('change', (e) => {
    settings.wallsEnabled = e.target.checked;
});

elements.soundEnabled.addEventListener('change', (e) => {
    settings.soundEnabled = e.target.checked;
});

elements.keyboardLayout.addEventListener('change', (e) => {
    settings.keyboardLayout = e.target.value;
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    
    const key = e.key.toLowerCase();
    const isAzerty = settings.keyboardLayout === 'azerty';

    // Up
    if (key === 'arrowup' || (isAzerty ? key === 'z' : key === 'w')) {
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
    }
    // Down
    else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
    }
    // Left
    else if (key === 'arrowleft' || (isAzerty ? key === 'q' : key === 'a')) {
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
    }
    // Right
    else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
    }
    // Pause
    else if (key === ' ') {
        e.preventDefault();
        if (isPaused) {
            resumeGame();
        } else {
            pauseGame();
        }
    }
    // Restart
    else if (key === 'r') {
        e.preventDefault();
        initGame();
    }
});

// ===================================================
// INITIALIZATION
// ===================================================
elements.highScore.textContent = highScore;
console.log('🐍 Snake Game chargé avec succès !');
console.log('Meilleur score actuel:', highScore);
