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
let backgroundCanvas = window.document.querySelector('#background-canvas');
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

let f1WallArray = [[-10,0],[15, 32], [42, 52], [64, 75], [92, 104],[119,129]];
let f2WallArray = [[54, 64]];
let isWallRight = false;
let isWallLeft = false;

let heroStep = 3;

// Function

const moveWorldLeft = () => {
    objectsArray.map((elem, index)=>{
        elem.style.left = `${Number.parseInt(elem.style.left) - 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] - 1;
    });
    enemiesArray.map(elem => elem.moveLeft());
    f1WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
    f2WallArray.map(elem => {
        elem[0] -= 1;
        elem[1] -= 1;
    });
}
const moveWorldRight = () => {
    objectsArray.map((elem, index)=>{
        elem.style.left = `${Number.parseInt(elem.style.left) + 32}px`;
    });
    tileArray.map(elem => {
        elem[0] = elem[0] + 1;
    });
    enemiesArray.map(elem => elem.moveRight());
    f1WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
    f2WallArray.map(elem => {
        elem[0] += 1;
        elem[1] += 1;
    });
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
    imgBlock.style.left = `${imgBlockPosition * heroStep}px`;

    checkFalling();
    wasHeroHit=false;
};

const checkRightWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if(heroY === 1){
        f1WallArray.map(elem => {
            if(heroX === elem[0] - 2){
                isWallRight = true;
            }
        })
    }else if(heroY === 5){
        f2WallArray.map(elem => {
            if(heroX === elem[0] - 2){
                isWallRight = true;
            }
        })
    }
}
const checkLeftWallCollide = () => {
    isWallLeft = false;
    isWallRight = false;
    if(heroY === 1){
        f1WallArray.map(elem => {
            if(heroX === elem[1]){
                isWallLeft = true;
            }
        })
    }else if(heroY === 5){
        f2WallArray.map(elem => {
            if(heroX === elem[1]){
                isWallLeft = true;
            }
        })
    }
}

// на право
const rightHandler = () => {
    if(!isRightSideBlocked && !isWallRight){
        heroImg.style.transform = 'scale(-1,1)';
        rightPosition += 1;
        imgBlockPosition += 1;
        if (rightPosition > 5) {
            rightPosition = -1;
        }
        updatePositions();
        moveWorldLeft();
        checkRightWallCollide();
    }
};

// на лево
const leftHandler = () => {
    if(!isLeftSideBlocked && !isWallLeft){
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
        checkLeftWallCollide();
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
    isWallRight = false;
    isWallLeft = false;
    switch (direction) {
        case "right": {
            heroImg.style.transform = 'scale(-1,1)';
            if (rightPosition > 4) {
                rightPosition = 1;
                jump=false;
                imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)+160}px`;
                imgBlockPosition += 20;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
            }
            break;
        }
        case "left": {
            heroImg.style.transform = 'scale(1,1)';
            if (rightPosition > 3) {
                rightPosition = 0;
                jump=false
                imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)+160}px`;
                imgBlockPosition -= 20;
                imgBlock.style.left = `${imgBlockPosition * heroStep}px`;
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
    backgroundCanvas.appendChild(tile);
    objectsArray.push(tile);
    tileArray.push([x,y]);
}

const createTileBlack = (x,y=0) => {
    let tileBlack = document.createElement('img');
    tileBlack.src = 'images/tiles/Tile4.png';
    tileBlack.style.position = 'absolute';
    tileBlack.style.left = `${x*32}px`;
    tileBlack.style.bottom = `${y*32}px`;
    backgroundCanvas.appendChild(tileBlack);
    objectsArray.push(tileBlack);
}
const createTilesPlatform = (startX, endX, floor) => {
    for (let x_pos = startX - 1 ; x_pos < endX; x_pos++) {
        createTiles(x_pos, floor);
    }
}
const createTilesBlackBlock = (startX, endX, floor) => {
    for (let y_pos = 0; y_pos < floor; y_pos++){
        for (let x_pos = startX - 1 ; x_pos < endX; x_pos++) {
            createTileBlack(x_pos, y_pos);
        }
    }
}
const  addTiles = (i) =>{
    createTiles(i);
    createTileBlack(i);

}

// Cutscene-----------------------------------------------------------
class Cutscene {
    text;
    block;
    p;
    nextButton;
    skipButton;
    constructor(text) {
        this.text = text;
        this.block = document.createElement('div');
        this.block.style.position = 'absolute';
        this.block.style.left = '10%';
        this.block.style.bottom = '10vh';
        this.block.style.width = '80%';
        this.block.style.height = '80vh';
        this.block.style.backgroundColor = '#38002c';
        this.block.style.border = '5px solid #8babbf';
        this.appendP();
        this.appendNextButton();
        this.appendSkipButton();
        this.setText(this.text);
        canvas.appendChild(this.block)
    }
    appendP(){
        this.p = document.createElement('p');
        this.p.style.position= 'absolute';
        this.p.style.left = '10%';
        this.p.style.top = '4vvh';
        this.p.style.width = '80%';
        this.p.style.color = '#8babbf';
        this.p.style.fontSize = '8pt';
        this.p.style.lineHeight = '1.5pt';
        this.p.style.fontFamily = "'Press Start 2P', system-ui";
        this.block.appendChild(this.p);
    }
    appendNextButton(){
        this.nextButton = document.createElement('button');
        this.setButtonStyle(this.nextButton, 'Next');
        this.nextButton.style.right = '0px';
        this.nextButton.onclick = () => {
            this.setText('Next');
        }
        this.block.appendChild(this.nextButton);

    }
    appendSkipButton(){
        this.skipButton = document.createElement('button');
        this.setButtonStyle(this.skipButton, 'Skip');
        this.skipButton.style.left = '0px';
        this.skipButton.onclick = () => {
            this.setText('Skip');
        }
        this.block.appendChild(this.skipButton);
    }
    setButtonStyle(button, title){
        button.style.position = 'absolute';
        button.style.bottom = '0px';
        button.style.backgroundColor = '#8babbf';
        button.style.color = '#38002c';
        button.innerText = title;
        button.style.margin = '20pt';
        button.style.padding = '10pt';
        button.style.border = 'none';
        button.style.fontFamily = "'Press Start 2P', system-ui";
    }
    setText(text){
        this.p.innerText = text;
    }
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
    constructor(x,y, src) {
        this.posX=x + this.getRandomOffset(6);
        this.startX= x;
        this.posY=y;
        this.blockSize=96;
        this.spritePos=0;
        this.spriteMaxPos=5;
        this.lastTime = 0;
        this.lastMoveTime =0;
        this.delay=100;
        this.sourcePath = src;
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
        if(this.posX>(this.startX+10)){
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
        if(this.stop || this.state === this.DEATH){
            this.block.style.left = `${Number.parseInt(this.block.style.left)+ 32}px`;
        }
    }
    moveLeft(){
        this.startX -= 1;
        this.posX -= 1;
        if(this.stop || this.state === this.DEATH){
            this.block.style.left = `${Number.parseInt(this.block.style.left) - 32}px`;
        }
    }
    getRandomOffset(max){
        let rand = Math.floor((Math.random()*max));
        return rand;
    }
}

class Enemy1 extends Enemy {
    constructor(x,y) {
        super(x,y, 'images/enemies/1/');
    }
}
class Enemy2 extends Enemy {
    constructor(x,y) {
        super(x,y, 'images/enemies/2/');
    }
    setWalk(){
        this.img.src = this.sourcePath+'enemi-walk.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setAttack(){
        this.img.src = this.sourcePath+'enemi-attack.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setHurt(){
        this.img.src = this.sourcePath+'enemi-hurt.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setDeath(){
        this.img.src = this.sourcePath+'enemi-death.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
}
class Enemy3 extends Enemy {
    constructor(x,y) {
        super(x,y, 'images/enemies/3/');
    }
    setWalk(){
        this.img.src = this.sourcePath+'3-walk.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setAttack(){
        this.img.src = this.sourcePath+'4-attack.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setHurt(){
        this.img.src = this.sourcePath+'4-hurt.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setDeath(){
        this.img.src = this.sourcePath+'4-death.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
}
// class Enemy4 extends Enemy {
//     bullet;
//     isShoot;
//     bulletX;
//     constructor(x,y) {
//         super(x,y, 'images/enemies/4/');
//         this.bullet = document.createElement('img');
//         this.bullet.src = this.sourcePath + 'Ball1.png';
//         this.bullet.style.position = 'absolute';
//         this.bullet.style.left = this.block.style.left;
//         this.bullet.style.bottom = `${Number.parseInt(this.block.style.bottom)+32}px`;
//         this.bullet.style.transform = 'scale(2,2)';
//         this.bullet.style.display = 'none';
//         canvas.appendChild(this.bullet);
//     }
//
//     setWalk(){
//         this.img.src = this.sourcePath+'3-walk.png';
//         this.img.style.top = `0px`;
//         this.img.style.height = '98px';
//     }
//     setAttack(){
//         this.img.src = this.sourcePath+'4-attack.png';
//         this.img.style.top = `0px`;
//         this.img.style.height = '98px';
//     }
//     setHurt(){
//         this.img.src = this.sourcePath+'4-hurt.png';
//         this.img.style.top = `0px`;
//         this.img.style.height = '98px';
//     }
//     setDeath(){
//         this.img.src = this.sourcePath+'4-death.png';
//         this.img.style.top = `0px`;
//         this.img.style.height = '98px';
//     }
//
//     checkCollide(){
//         if(heroY===this.posY) {
//             this.stop=true;
//             if(heroX > this.posX){
//                 this.dir = 1;
//                 this.img.style.transform = 'scale(1,1)';
//             } else {
//                 this.dir = -1;
//                 this.img.style.transform = 'scale(-1,1)';
//             }
//             if(heroX === this.posX){
//                 // left
//                 this.checkHurt();
//                 isRightSideBlocked=true;
//                 // this.stop=true;
//             } else if(heroX === (this.posX+3)){
//                 //right
//                 this.checkHurt();
//                 isLeftSideBlocked=true;
//                 // this.stop=true;
//             }else {
//                 isRightSideBlocked = false;
//                 isLeftSideBlocked = false;
//                 // this.stop = false;
//                 this.changeAnimate(this.WALK);
//             }
//         } else {
//             isRightSideBlocked = false;
//             isLeftSideBlocked = false;
//             this.stop=false;
//             this.changeAnimate(this.WALK);
//         }
//     }
//     animate(){
//         const currentTime = new Date().getTime();
//         if (currentTime - this.lastTime > this.delay){
//
//             if(this.animateWasChanged){
//                 this.animateWasChanged=false;
//                 switch (this.state){
//                     case this.ATTACK:{
//                         this.setAttack();
//                         break;
//                     }
//                     case this.DEATH:{
//                         this.setDeath()
//                         break;
//                     }
//                     case this.HURT:{
//                         this.setHurt();
//                         break;
//                     }
//                     // case this.IDLE:{
//                     //     this.setIdle();
//                     //     break;
//                     // }
//                     case this.WALK:{
//                         this.setWalk();
//                         break;
//                     }
//                     default: break;
//                 }
//             }
//
//             this.spritePos++;
//             if(this.spritePos>this.spriteMaxPos){
//                 this.spritePos=0;
//                 if (this.state===this.ATTACK){
//                     if(!this.isShoot) this.shoot();
//                 }
//                 if(this.state === this.HURT){
//                     this.changeAnimate(this.ATTACK);
//                 }
//                 if(this.state === this.DEATH){
//                     isRightSideBlocked=false;
//                     isLeftSideBlocked=false;
//                     return;
//                 }
//             }
//             if(this.isShoot && this.state === this.ATTACK){
//                 this.bulletFunc();
//             }else {
//                 this.img.style.display = 'none';
//             }
//             // this.img.style.left = `${-(this.spritePos*this.blockSize)}px`;
//
//             // if (currentTime - this.lastMoveTime > this.delayMove) {
//             //     console.log()
//             //     this.move();
//             //     this.lastMoveTime = currentTime;
//             // }
//             this.checkCollide();
//             if(!this.stop){
//                 this.move();
//             }else {
//                 if(this.state !== this.DEATH){
//                     if(this.state !== this.HURT){
//                         this.changeAnimate(this.ATTACK);
//                     }
//                 }
//             }
//             this.lastTime = currentTime;
//         }
//
//         requestAnimationFrame(()=> this.animate());
//     }
//     shoot(){
//         this.isShoot = true;
//         this.bullet.style.display = 'block';
//         (this.dir>0) ? this.bulletX=this.posX+2 : this.bullet = this.posX+1;
//     }
//     bulletFunc(){
//         (this.dir>0) ? this.bulletX+=1 : this.bullet -=1;
//         this.bullet.style.left = `${this.bulletX * 32}px`;
//         if(this.bulletX === heroX && this.posY === heroY){
//             this.isShoot = false;
//             this.bullet.style.display = 'none';
//             lives--;
//             updateHearts();
//         }
//         if(this.dir>0){
//             if(this.bulletX > (this.posX + 6)){
//                 this.isShoot = false;
//                 this.bullet.style.display = 'none';
//             }
//         } else {
//             if(this.bulletX < (this.posX - 5)){
//                 this.isShoot = false;
//                 this.bullet.style.display = 'none';
//             }
//         }
//     }
// }
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

const createBackImg = (i) => {
    let img = document.createElement('img');
    img.src = 'images/background/1.webp';
    img.style.position = 'absolute';
    img.style.left = `${(i*window.screen.width)-32}px`;
    img.style.bottom = '32px';
    img.style.width = `${window.screen.width}px`;
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}
const addBackgroundImages = () => {
    for(let i = 0; i < 3; i++){
        createBackImg(i);
    }
}
const createImgEl = (src, x, y) => {
    let img = window.document.createElement('img');
    img.src = src;
    img.style.position = 'absolute';
    img.style.left = `${x*32}px`;
    img.style.bottom = `${y*32}px`;
    img.style.transform = 'scale(2,2) translate(-25%, -25%)';
    backgroundCanvas.appendChild(img);
    objectsArray.push(img);
}
const addDecorationElements = (f1, f2, f3,f4) => {
    let basePath = 'images/Objects/';
    //Tree
    createImgEl(basePath + '/Other/Tree4.png', 4, f1);
    createImgEl(basePath + 'Other/Tree2.png', 35, f1);
    createImgEl(basePath + '/Other/Tree3.png', 78, f1);
    createImgEl(basePath + 'Other/Tree4.png', 108, f1);
    createImgEl(basePath + '/Other/Tree1.png', 58, f3);
    //Stone
    createImgEl(basePath + '/Stones/6.png', 10, f1);
    createImgEl(basePath + '/Stones/4.png', 111, f1);
    createImgEl(basePath + '/Stones/4.png', 38, f1);
    createImgEl(basePath + '/Stones/6.png', 102, f3);
    //Ramp
    createImgEl(basePath + '/Other/Ramp1.png', 22, f4);
    createImgEl(basePath + '/Other/Ramp2.png', 26, f3);
    createImgEl(basePath + '/Other/Ramp1.png', 95, f3);
    createImgEl(basePath + '/Other/Ramp2.png', 99, f4);
    createImgEl(basePath + '/Other/Ramp1.png', 45, f3);
    createImgEl(basePath + '/Other/Ramp2.png', 49, f3);
    //Bushes
    // createImgEl(basePath + '/Bushes/17.png', 84, f1);
    // createImgEl(basePath + '/Bushes/17.png', 19, f2);
    // createImgEl(basePath + '/Bushes/17.png', 50, f2);
    // createImgEl(basePath + '/Bushes/17.png', 69, f2);
    // createImgEl(basePath + '/Bushes/17.png', 100, f2);
    // createImgEl(basePath + '/Bushes/17.png', 13, f3);
    //Fountain
    createImgEl(basePath + '/Fountain/2.png', 116, f1);
    //Box
    createImgEl(basePath + '/Other/Box.png', 84, f1);
    createImgEl(basePath + '/Other/Box.png', 50, f1);
    createImgEl(basePath + '/Other/Box.png', 14, f3);
    createImgEl(basePath + '/Other/Box.png', 64, f2);
}
const addEnemies = () => {
    let ememy1 = new Enemy1(5,10);
    let ememy2 = new Enemy2(14,5);
    let ememy3 = new Enemy3(52,10);
    // let ememy4 = new Enemy4(40,5);
};
const buildLevel = () => {
    let floor1 = 0;
    let floor2 = 4;
    let floor3 = 9;
    let floor4 = 12;

    addDecorationElements(floor1 + 1, floor2 + 1, floor3 + 1,floor4+1);

    createTilesPlatform(0, 14, floor1);
    createTilesPlatform(33, 41, floor1);
    createTilesPlatform(76, 91, floor1);
    createTilesPlatform(106, 170, floor1);

    createTilesPlatform(15, 32, floor2);
    createTilesPlatform(42, 53, floor2);
    createTilesPlatform(64, 75, floor2);
    createTilesPlatform(92, 105, floor2);

    createTilesPlatform(8, 23, floor3);
    createTilesPlatform(54, 63, floor3);
    createTilesPlatform(75, 87, floor3);
    createTilesPlatform(99, 111, floor3);

    createTilesBlackBlock(15, 32, floor2);
    createTilesBlackBlock(15, 32, floor2);
    createTilesBlackBlock(42, 53, floor2);
    createTilesBlackBlock(64, 75, floor2);
    createTilesBlackBlock(92, 105, floor2);

    createTilesBlackBlock(54, 63, floor3);

    addEnemies();
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
    // for (let i=0; i<50;i++) {
    //     if (i>10 && i<15){
    //         continue;
    //     }
    //     addTiles(i);
    // }
    // createTilesPlatform(11,5,5);

    // let enemy = new Enemy(20,2);
    addHearts();
    updateHearts();
    addBackgroundImages();
    buildLevel();
    let cutscene = new Cutscene('Hello world');
    lifeCycle();
}

start();

