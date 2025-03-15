const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

// Board boyutları
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30;

// Renkler (her Tetris parçası için farklı renkler)
const colors = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Tetris parçaları (şekilleri ve renkleri ile)
const tetrominos = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]]  // Z
];

// Boş bir board oluşturuyoruz
let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));

// Yeni bir tetromino (Tetris parçası) oluşturma
function generateTetromino() {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    const shape = tetrominos[randomIndex];
    const color = colors[randomIndex];
    return { shape, color };
}

let currentTetromino = generateTetromino();
let currentPos = { row: 0, col: Math.floor(COLUMNS / 2) };

// Oyun alanını çizme fonksiyonu
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (board[row][col]) {
                ctx.fillStyle = board[row][col];
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Tetris parçasını çizme
function drawTetromino() {
    const { shape, color } = currentTetromino;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                ctx.fillStyle = color;
                ctx.fillRect((currentPos.col + col) * BLOCK_SIZE, (currentPos.row + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

// Parçayı aşağıya hareket ettirme
function moveTetrominoDown() {
    currentPos.row++;
    if (checkCollision()) {
        currentPos.row--;
        placeTetromino();
        currentTetromino = generateTetromino();
        currentPos = { row: 0, col: Math.floor(COLUMNS / 2) };
        if (checkCollision()) {
            alert('Game Over!');
            board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
        }
    }
}

// Çarpışma kontrolü
function checkCollision() {
    const { shape } = currentTetromino;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                const newRow = currentPos.row + row;
                const newCol = currentPos.col + col;
                if (newRow >= ROWS || newCol < 0 || newCol >= COLUMNS || board[newRow][newCol]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Parçayı board'a yerleştirme
function placeTetromino() {
    const { shape, color } = currentTetromino;
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                board[currentPos.row + row][currentPos.col + col] = color;
            }
        }
    }
}

// Oyun döngüsü
function gameLoop() {
    moveTetrominoDown();
    drawBoard();
    drawTetromino();
}

// Her 500 ms'de bir gameLoop çalıştır (oyunun hızını ayarlamak)
setInterval(gameLoop, 500);
