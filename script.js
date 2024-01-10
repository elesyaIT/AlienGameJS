// Variables
let heroImg = document.querySelector('#hero-img');
let imgBlock = document.querySelector('#img-block');
let rightPosition = 0;
let imgBlockPosition = 0;

let isMoving = false;
let animationFrameId = null;

let lastTime = 0;
const delay = 70; // Задержка в миллисекундах

let canvas = document.querySelector("#canvas");
let fsBtn = document.querySelector("#fsBtn");

let direction = 'right';
let hit = false;
let jump = false;
let fall = false;

let heroX = Math.round((Number.parseInt(imgBlock.style.left)+32)/32);
let heroY = Math.round(Number.parseInt(imgBlock.style.bottom)/32);
let info = document.querySelector('#info');

let tileArray = [];

// Function
const updateHeroXY=()=>{
    heroX = Math.round((Number.parseInt(imgBlock.style.left)+32)/32);
    heroY = Math.round(Number.parseInt(imgBlock.style.bottom)/32);
    info.innerText= `heroX= ${heroX};heroY= ${heroY}`;
}

const checkFalling = () => {
    updateHeroXY();
    let isFalling = tileArray.filter(tile => tile[0] === heroX && tile[1] + 1 === heroY).length === 0;

    if(isFalling){
        info.innerText+='falling';
        fall = true;
    } else {
        info.innerText+='not falling';
        fall = false;
    }
}

const fallHandler = () => {
    imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)-40}px`;
    checkFalling();
    // fall=false;
}
// перемещение блока
const updatePositions = () => {

    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-192px';
    imgBlock.style.left = `${imgBlockPosition * 20}px`;

    checkFalling();
};

// на право
const rightHandler = () => {
    heroImg.style.transform = 'scale(-1,1)';
    rightPosition += 1;
    imgBlockPosition += 1;
    if (rightPosition > 5) {
        rightPosition = -1;
    }
    updatePositions();
};

// на лево
const leftHandler = () => {
    heroImg.style.transform = 'scale(1,1)';
    rightPosition += 1;
    imgBlockPosition -= 1;
    if (rightPosition > 5) {
        rightPosition = -1;
    }
    if (imgBlockPosition < 0) {
        imgBlockPosition = 0;
    }
    updatePositions();
};

const hitHandler = () => {
    switch (direction) {
        case "right": {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 0;
                hit=false;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = -1;
                hit=false;
            }
            break;
        }
        default: break;
    }
    rightPosition += 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-288px';
};
const jumpHandler = () => {
    switch (direction) {
        case "right": {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 0;
                jump=false;
                imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)+160}px`;
                imgBlockPosition += 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = -1;
                jump=false
                imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)+160}px`;
                imgBlockPosition -= 10;
                imgBlock.style.left = `${imgBlockPosition * 20}px`;
            }
            break;
        }
        default: break;
    }
    rightPosition += 1;
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '-96px';
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
    heroImg.style.left = `-${rightPosition * 96}px`;
    heroImg.style.top = '0px';
    checkFalling();
};

// Полный экран----------------------------
fsBtn.onclick = () => {
    if (document.fullscreen) {
        fsBtn.src = 'images/screen/fullscreen.png';
        document.exitFullscreen();
    } else {
        fsBtn.src = 'images/screen/cancel.png';
        canvas.requestFullscreen();
    }
};


const lifeCycle = (timestamp) => {

    const currentTime = new Date().getTime();
    if (currentTime - lastTime > delay) {
        if (hit) {
            hitHandler();
        } else if (jump) {
            jumpHandler();
        } else if (fall){

            fallHandler();
        }else {
            standHandler();
        }
        lastTime = currentTime;
    }


    if (!isMoving) {
        animationFrameId = requestAnimationFrame(lifeCycle);
    }
};
//------------------------------------------------------------------
// ДОРОГА
const createTiles = (x,y=1) => {
    let tile = document.createElement('img');
    let tileBlack = document.createElement('img');
    tile.src = 'images/tiles/Tile1.png';
    tile.style.position = 'absolute';
    tile.style.left = `${x*32}px`;
    tile.style.bottom = `${y*32}px`;
    canvas.appendChild(tile);

    tileArray.push([x,y]);
}

const createTilesPlatform= (startX, startY, length) =>{
    for (let i=0; i<length;i++){
        createTiles(startX+i,startY)
    }
}
const  addTiles = (i) =>{
    createTiles(i);

    let tileBlack = document.createElement('img');
    tileBlack.src = 'images/tiles/Tile4.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${i*32}px`;
    tileBlack.style.bottom = '0px';
    canvas.appendChild(tileBlack);

}

// Handlers -------------------------------------------------------------------------------

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
                } else if (event.code === 'KeyW') {
                    jump = true;
                    console.log(jump);
                }else if (event.code === 'KeyE') {
                    hit = true;
                    console.log(hit);
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
const start = () => {
    for (let i=0; i<50;i++) {
        if (i>10 && i<15){
            continue;
        }
        addTiles(i);
    }

    createTilesPlatform(11,5,5);
    lifeCycle();
}

start();

