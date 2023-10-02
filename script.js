const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockSize = 10;
const canvasWidth = 400;
const canvasHeight = 400;
const devicePixelRatio = window.devicePixelRatio || 1;
const blockWidth = canvasWidth / blockSize;
const blockHeight = canvasHeight / blockSize;

canvas.width = canvasWidth * devicePixelRatio;
canvas.height = canvasHeight * devicePixelRatio;
canvas.style.width = `${canvasWidth}px`;
canvas.style.height = `${canvasHeight}px`;
ctx.scale(devicePixelRatio, devicePixelRatio);

let snake = [{x: 5, y: 5}];
let direction = 'right';
let food = generateFood();
let score = 0;

function generateFood() {
    return {
        x: Math.floor(Math.random() * blockWidth),
        y: Math.floor(Math.random() * blockHeight)
    };
}

function drawBlock(x, y) {
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(block => drawBlock(block.x, block.y));
}

function moveSnake() {
    const head = {x: snake[0].x, y: snake[0].y};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= blockWidth || head.y < 0 || head.y >= blockHeight) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function drawFood() {
    ctx.fillStyle = 'red';
    drawBlock(food.x, food.y);
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    moveSnake();
    if (checkCollision()) {
        clearInterval(intervalId);
        alert(`Game over! Your score is ${score}`);
    } else {
        drawSnake();
        drawFood();
        drawScore();
    }
}

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', event => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', event => {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const touchDiffX = touchEndX - touchStartX;
    const touchDiffY = touchEndY - touchStartY;

    if (Math.abs(touchDiffX) > Math.abs(touchDiffY)) {
        if (touchDiffX > 0 && direction !== 'left') {
            direction = 'right';
        } else if (touchDiffX < 0 && direction !== 'right') {
            direction = 'left';
        }
    } else {
        if (touchDiffY > 0 && direction !== 'up') {
            direction = 'down';
        } else if (touchDiffY < 0 && direction !== 'down') {
            direction = 'up';
        }
    }
});

const intervalId = setInterval(gameLoop, 100);