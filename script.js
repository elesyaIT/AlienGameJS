// Variables
let heroImg = document.querySelector('#hero-img');
let imgBlock = document.querySelector('#img-block');
let rightPosition = 0;
let imgBlockPosition = 0;

let isMoving = false;
let animationFrameId = null;

let lastTime = 0;
const delay = 100; // Задержка в миллисекундах

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
                rightPosition = 1;
                hit=false;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
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
                rightPosition = 1;
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
                rightPosition = 0;
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
                rightPosition = 1;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
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

//ВРАГИ------------------------------------------------------------------------------------
class Enemy {
    ATTACK = 'attack';
    DEATH = 'death';
    HURT= 'hurt';
    IDLE = 'idle';
    WALK = 'walk';

    state;
    animateWasChanged;

    startX;
    posX;
    posY;
    img;
    block;
    blockSize;
    spritePos;
    spriteMaxPos;
    lastTime;
    lastMoveTime;
    delay;
    dir;
    delayMove;
    stop;

    sourcePath;
    constructor(x,y) {
        this.posX=x;
        this.startX= this.posX;
        this.posY=y;
        this.blockSize=96;
        this.spritePos=0;
        this.spriteMaxPos=5;
        this.lastTime = 0;
        this.lastMoveTime =0;
        this.delay=100;
        this.sourcePath = 'images/enemies/';
        this.dir = 1;
        this.delayMove = 110;
        this.stop = false;

        this.state = this.IDLE;
        this.animateWasChanged = false;

        this.createImg();
        this.changeAnimate(this.WALK);
        this.lifeCycle();
    }
    createImg() {
        this.block = document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.overflow = 'hidden';
        this.block.style.left = `${this.posX*32}px`;
        this.block.style.bottom = `${this.posY*32}px`;
        this.block.style.width = `${this.blockSize}px`;
        this.block.style.height = `${this.blockSize-10}px`;
        canvas.appendChild(this.block);

        this.img = document.createElement('img');
        this.img.src = this.sourcePath+'alian2.png';
        this.img.style.position = 'absolute';
        this.img.style.top = `${0}px`;
        this.img.style.bottom = `${0}px`;
        this.img.style.width = `${this.blockSize*6}px`;
        this.img.style.height = `${this.blockSize*4}px`;
        this.block.appendChild(this.img);
    }
    lifeCycle(){
        this.animate();
    }
    animate(){
        const currentTime = new Date().getTime();
        if (currentTime - this.lastTime > this.delay){

            if(this.animateWasChanged){
                this.animateWasChanged=false;
                switch (this.state){
                    case this.ATTACK:{
                        this.setAttack();
                        break;
                    }
                    case this.DEATH:{
                        // this.img.style.width = `${this.blockSize * 6}px`;
                        this.setDeath()
                        break;
                    }
                    // case this.HURT:{
                    //     this.img.style.width = `${this.blockSize * 2}px`;
                    //     this.setHurt();
                    //     break;
                    // }
                    // case this.IDLE:{
                    //     this.setIdle();
                    //     break;
                    // }
                    case this.WALK:{
                        this.setWalk();
                        break;
                    }
                    default: break;
                }
            }

            this.spritePos++;
            if(this.spritePos>this.spriteMaxPos){
                this.spritePos=0;
            }
            this.img.style.left = `${-(this.spritePos*this.blockSize)}px`;

            // if (currentTime - this.lastMoveTime > this.delayMove) {
            //     console.log()
            //     this.move();
            //     this.lastMoveTime = currentTime;
            // }
            this.checkCollide();
            if(!this.stop){
                this.move();
            }else {
                this.changeAnimate(this.ATTACK)
            }
            this.lastTime = currentTime;
        }

        requestAnimationFrame(()=> this.animate());
    }
    setAttack(){
        // this.img.style.left = `-${rightPosition * 96}px`;
        this.img.style.top = `-300px`;
    }
    setDeath(){
        this.img.style.left = `-${rightPosition * 96}px`;
    }
    setHurt(){
        this.img.style.left = `-${rightPosition * 96}px`;
    }
    setIdle(){
        this.img.style.left = `-${rightPosition * 96}px`;
    }
    setWalk(){
        this.img.style.top = `0px`;
    }

    changeAnimate(stateStr){
        this.state = stateStr;
        this.animateWasChanged = true;
    }
    move(){
        if(this.posX>(this.startX+15)){
            this.dir *=-1;
            this.img.style.transform = "scale(1,1)";
        } else if(this.posX<=this.startX){
            this.dir= Math.abs(this.dir);
            this.img.style.transform = "scale(-1,1)";
        }
        this.posX +=this.dir;
        this.block.style.left = `${this.posX * 32}px`;
    }
    checkCollide(){
        if(heroY===this.posY) {
            if(heroX === this.posX){
                this.stop=true;
                // left
            } else if(heroX === (this.posX+2)){
                this.stop=true;
                //right
            }else {
                this.stop = false;
                this.changeAnimate(this.WALK);
            }
        } else {
            this.stop=false;
            this.changeAnimate(this.WALK);
        }
    }
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

    let enemy = new Enemy(20,2);

    lifeCycle();
}

start();

