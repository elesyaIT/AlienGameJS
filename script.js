// Variables
let heroImg = document.querySelector('#hero-img');
let imgBlock = document.querySelector('#img-block');
let rightPosition = 0;
let imgBlockPosition = 0;

let isMoving = false;

let lastTime = 0;
const delay = 70; // Задержка в миллисекундах

let canvas = document.querySelector("#canvas");
let fsBtn = document.querySelector("#fsBtn");

let direction = 'right';

// Function

// перемещение блока
const updatePositions = () => {
    heroImg.style.left = `-${rightPosition * 288}px`;
    heroImg.style.top = '-586px';
    imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

// на право
const rightHandler = () => {
    heroImg.style.transform = 'scale(-1,1)';
    rightPosition += 1;
    imgBlockPosition += 1;
    if (rightPosition > 5) {
        rightPosition = 0;
    }
    updatePositions();
};

// на лево
const leftHandler = () => {
    heroImg.style.transform = 'scale(1,1)';
    rightPosition += 1;
    imgBlockPosition -= 1;
    if (rightPosition > 5) {
        rightPosition = 0;
    }
    if (imgBlockPosition < 0) {
        imgBlockPosition = 0;
    }
    updatePositions();
};

const standHandler = () => {
    switch (direction) {
        case "right": {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 0;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = -1;
            }
            break;
        }
        default: break;
    }
    rightPosition += 1;
    heroImg.style.left = `-${rightPosition * 288}px`;
    heroImg.style.top = '0px';
};

// Полный экран
fsBtn.onclick = () => {
    if (document.fullscreen) {
        fsBtn.src = 'screen/fullscreen.png';
        document.exitFullscreen();
    } else {
        fsBtn.src = 'screen/cancel.png';
        canvas.requestFullscreen();
    }
};

let animationFrameId = null;

const lifeCycle = (timestamp) => {
    const currentTime = new Date().getTime();
    if (currentTime - lastTime > delay) {
        standHandler();
        lastTime = currentTime;
    }

    if (!isMoving) {
        animationFrameId = requestAnimationFrame(lifeCycle);
    }
};

// Handlers

window.addEventListener('keydown', (event) => {
    if (!event.repeat && !isMoving) {
        isMoving = true;

        function move() {
            const currentTime = new Date().getTime();
            if (currentTime - lastTime > delay) {
                if (event.code === 'KeyD') {
                    direction = 'right';
                    rightHandler();
                } else if (event.code === 'KeyA') {
                    direction = 'left';
                    leftHandler();
                }
                lastTime = currentTime;
            }
            if (isMoving) {
                requestAnimationFrame(move);
            }
        }
        move();
    }
});

window.addEventListener('keyup', () => {
    isMoving = false;
    if (animationFrameId) {
        animationFrameId = requestAnimationFrame(lifeCycle);
    }
});

// Начать анимацию
lifeCycle();
