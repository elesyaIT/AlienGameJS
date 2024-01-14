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
let objectsArray = [];
let enemiesArray = [];

let maxLives = 6;
let lives = 6;
let heartsArray = [];

let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;

// Function

const moveWorldLeft = () => {
    objectsArray.map((elem, index)=>{
        elem.style.left = `${Number.parseInt(elem.style.left) - 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    });
    enemiesArray.map(elem => elem.moveLeft());
    // f1WallArray.map(elem => {
    //     elem[0] -= 1;
    //     elem[1] -= 1;
    // });
    // f2WallArray.map(elem => {
    //     elem[0] -= 1;
    //     elem[1] -= 1;
    // });
}
const moveWorldRight = () => {
    objectsArray.map((elem, index)=>{
        elem.style.left = `${Number.parseInt(elem.style.left) + 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    });
    enemiesArray.map(elem => elem.moveRight());
    // f1WallArray.map(elem => {
    //     elem[0] += 1;
    //     elem[1] += 1;
    // });
    // f2WallArray.map(elem => {
    //     elem[0] += 1;
    //     elem[1] += 1;
    // });
}
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
    wasHeroHit=false;
};

// на право
const rightHandler = () => {
    if(!isRightSideBlocked){
        heroImg.style.transform = 'scale(-1,1)';
        rightPosition += 1;
        imgBlockPosition += 1;
        if (rightPosition > 5) {
            rightPosition = -1;
        }
        updatePositions();
        moveWorldLeft();
    }
};

// на лево
const leftHandler = () => {
    if(!isLeftSideBlocked){
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
        moveWorldRight();
    }
};

const hitHandler = () => {
    switch (direction) {
        case "right": {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
                hit=false;
                wasHeroHit=true;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
                hit=false;
                wasHeroHit=true;
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
    objectsArray.push(tile);
    tileArray.push([x,y]);
}

const createTileBlack = (x,y=0) => {
    let tileBlack = document.createElement('img');
    tileBlack.src = 'images/tiles/Tile4.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${x*32}px`;
    tileBlack.style.bottom = `${y*32}px`;
    canvas.appendChild(tileBlack);
    objectsArray.push(tileBlack);
}
const createTilesPlatform= (startX, startY, length) =>{
    for (let i=0; i<length;i++){
        createTiles(startX+i,startY)
    }
}
const  addTiles = (i) =>{
    createTiles(i);
    createTileBlack(i);

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
    lives

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
        this.lives = 40;

        this.state = this.IDLE;
        this.animateWasChanged = false;

        this.createImg();
        this.changeAnimate(this.WALK);
        enemiesArray.push(this);
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
        this.img.src = this.sourcePath+'alian3.png';
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
                        this.setDeath()
                        break;
                    }
                    case this.HURT:{
                        this.setHurt();
                        break;
                    }
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
                if (this.state===this.ATTACK){
                    lives--;
                    updateHearts();
                }
                if(this.state === this.HURT){
                    this.changeAnimate(this.ATTACK);
                }
                if(this.state === this.DEATH){
                    isRightSideBlocked=false;
                    isLeftSideBlocked=false;
                    return;
                }
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
                if(this.state !== this.DEATH){
                    if(this.state !== this.HURT){
                        this.changeAnimate(this.ATTACK);
                    }
                }
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
        this.img.style.top = `-200px`;
    }
    setHurt(){
        this.img.style.top = `-100px`;
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
    checkHurt(){
        if(wasHeroHit){
            if(this.lives <=10){
                wasHeroHit=false;
                this.changeAnimate(this.DEATH);
            }else {
                wasHeroHit=false;
                this.changeAnimate(this.HURT);
                this.showHurt();
                this.lives -= 10;
            }
        }
    }
    checkCollide(){
        if(heroY===this.posY) {
            if(heroX === this.posX){
                // left
                this.checkHurt();
                isRightSideBlocked=true;
                this.stop=true;
            } else if(heroX === (this.posX+3)){
                //right
                this.checkHurt();
                isLeftSideBlocked=true;
                this.stop=true;
            }else {
                isRightSideBlocked = false;
                isLeftSideBlocked = false;
                this.stop = false;
                this.changeAnimate(this.WALK);
            }
        } else {
            isRightSideBlocked = false;
            isLeftSideBlocked = false;
            this.stop=false;
            this.changeAnimate(this.WALK);
        }
    }
    showHurt(){
        let pos = 0;
        let text = window.document.createElement('p');
        text.innerText = '-10';
        text.style.position = 'absolute';
        text.style.left = `${(this.dir < 0) ? Number.parseInt(this.block.style.left) + 50 : Number.parseInt(this.block.style.left) + 10}px`;
        text.style.bottom = `${Number.parseInt(this.block.style.bottom) + 32}px`;
        text.style.fontFamily = "'Bungee Spice', cursive";
        let hurtTimer = setInterval(()=>{
            text.style.bottom = `${Number.parseInt(text.style.bottom) + 16}px`;
            if(pos > 2){
                clearInterval(hurtTimer);
                text.style.display = 'none';
            }
            pos++;
        }, 100);
        canvas.appendChild(text);
    }
    moveRight(){
        this.startX += 1;
        this.posX += 1;
    }
    moveLeft(){
        this.startX -= 1;
        this.posX -= 1;
    }
}

//Сердце----------------------------------------------------------------------------------
class Heart {
    img;
    x;
    constructor(x,src) {
        this.x=x+1;
        this.img = document.createElement('img');
        this.img.src = src;
        this.img.style.position='absolute';
        this.img.style.left = `${this.x*32}px`;
        this.img.style.bottom = `90%`;
        this.img.style.width = '55px';
        this.img.style.height = '55px';

        canvas.appendChild(this.img);
    }
}
class HeartEmpty extends Heart{
    constructor(x) {
        super(x, 'images/hearts/heartempty.png');
    }

}

class HeartRed extends Heart{
    constructor(x) {
        super(x, 'images/hearts/heart.png');
    }
}

const addHearts = () => {
    for (let i = 0; i<maxLives; i++){
        let heartEmpty= new HeartEmpty(i);
        let heartRed = new HeartRed(i);
        heartsArray.push(heartRed);
    }
}
const updateHearts = () => {
    if(lives<1) {
        lives=1;
    }
    for (let i=0; i<lives;i++){
        heartsArray[i].img.style.display = 'block';
    }
    for (let i = lives;i<maxLives;i++){
        heartsArray[i].img.style.display = 'none';
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
    addHearts();
    updateHearts();

    lifeCycle();
}

start();

