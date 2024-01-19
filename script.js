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
let backgroundCanvas = document.querySelector('#background-canvas');
let fsBtn = document.querySelector("#fsBtn");
let restartBtn = document.querySelector('#restartBtn');

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

let maxLives = 7;
let lives = 7;
let heartsArray = [];

let isRightSideBlocked = false;
let isLeftSideBlocked = false;
let wasHeroHit = false;

let f1WallArray = [[-10,0],[15, 32], [42, 52], [60, 77], [92, 107],[119,129]];
let f2WallArray = [[54, 64]];
let isWallRight = false;
let isWallLeft = false;

let heroStep = 3;

let finalTimerText = document.querySelector('#final-timer-text');

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
    if(heroY<=0) {
        lives=0;
        updateHearts();
    }
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
    heroImg.style.top = '-96px';
    imgBlock.style.bottom = `${parseInt(imgBlock.style.bottom)-40}px`;
    checkFalling();
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
    if(!fall) {
        if (!isRightSideBlocked && !isWallRight) {
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
    }else {
        fallHandler();
    }
};

// на лево
const leftHandler = () => {
    if(!fall){
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
    }else {
        fallHandler();
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
restartBtn.addEventListener('click', ()=>{
    document.location.reload();
});

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

//Teleport
class Lever {
    leverImg;
    x;
    y;
    updateTimer;
    finalTimer;
    time;
    dir;
    opacity;
    fountainImg;
    constructor() {
        this.fountainImg = objectsArray.filter(elem => elem.outerHTML.split('"')[1] === 'images/Objects/Fountain/2.png')[0];
        this.x = heroX + 2;
        this.y = heroY;
        this.leverImg = document.createElement('img');
        this.leverImg.src = 'images/exit/lever.png';
        this.leverImg.style.position = 'absolute';
        this.leverImg.style.left = `${this.x * 32}px`;
        this.leverImg.style.bottom = `${this.y * 32}px`;
        this.leverImg.style.width = `64px`;
        this.leverImg.style.height = `64px`;
        canvas.appendChild(this.leverImg);
        enemiesArray.push(this);

        this.time = 30;
        this.dir = true;
        this.opacity = 1;
        this.updateTimer = setInterval(()=>{
            if(heroX === this.x + 1 && heroY === this.y){
                this.leverImg.style.display = 'none';
                clearInterval(this.updateTimer);
                new Cutscene(['Quickly run to the teleporter!']);
            }else{
                this.animate();
            }
        }, 100);
        this.finalTimer = setInterval(()=>{
            if(this.time <= 0){
                finalTimerText.innerText = 'Game over';
                imgBlock.style.display = 'none';
                lives=0;
                updateHearts();
                clearInterval(this.finalTimer);
            }else{
                finalTimerText.innerText = `${this.time}`;
                this.time--;
                if(heroX === Number.parseInt(this.fountainImg.style.left)/32){
                    new Terminal();
                    clearInterval(this.finalTimer);
                    // finalTimerText.innerText = 'Win';
                }
            }
        }, 1000);
    }
    animate(){
        (this.dir) ? this.opacity += 0.5 : this.opacity -= 0.5;
        this.leverImg.style.opacity = `${1/this.opacity}`;
        if(this.opacity <= 0 || this.opacity >= 5) this.dir = !this.dir;
    }

    moveLeft(){
        this.leverImg.style.left = `${Number.parseInt(this.leverImg.style.left) - 32}px`;
        this.x -= 1;
    }
    moveRight(){
        this.leverImg.style.left = `${Number.parseInt(this.leverImg.style.left) + 32}px`;
        this.x += 1;
    }
}

// Cutscene-----------------------------------------------------------
class Cutscene {
    text;
    block;
    p;
    nextButton;
    skipButton;
    page;
    constructor(text) {
        this.page = 0;
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
        this.setText(this.text[this.page]);
        canvas.appendChild(this.block)
    }
    appendP(){
        this.p = document.createElement('p');
        this.p.style.position= 'absolute';
        this.p.style.left = '10%';
        this.p.style.top = '4vvh';
        this.p.style.width = '80%';
        this.p.style.color = '#8babbf';
        this.p.style.fontSize = '15pt';
        this.p.style.lineHeight = '20pt';
        this.p.style.fontFamily = "'Press Start 2P', system-ui";
        this.p.onclick = () => {
            this.nextButton.style.display = 'block';
            clearInterval(this.timer);
            this.p.innerText = this.text[this.page];
        }
        this.block.appendChild(this.p);
    }
    appendNextButton(){
        this.nextButton = document.createElement('button');
        this.setButtonStyle(this.nextButton, 'Next');
        this.nextButton.style.right = '0px';
        this.nextButton.style.display = 'none';
        this.nextButton.onclick = () => {
            if( this.page < this.text.length - 1){
                this.page++;
                this.setText(this.text[this.page]);
                this.nextButton.style.display = 'none';
            }else {
                this.block.style.display = 'none';
            }

        }
        this.block.appendChild(this.nextButton);

    }
    appendSkipButton(){
        this.skipButton = document.createElement('button');
        this.setButtonStyle(this.skipButton, 'Skip');
        this.skipButton.style.left = '0px';
        this.skipButton.onclick = () => {
            this.block.style.display = 'none';
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
        if(this.page === this.text.length - 1) this.nextButton.innerText = 'Go';
        let innerText = '';
        let targetText = text;
        let pos = 0;
        this.timer = setInterval(()=>{
            if(pos <= targetText.length - 1){
                innerText += targetText[pos];
                this.p.innerText = innerText;
                pos++;
            }else{
                clearInterval(this.timer);
                this.nextButton.style.display = 'block';
            }
        },20);
    }
}
class Terminal extends Cutscene {
    btnBlock;
    mainStrLength;
    password;
    constructor(){
        let text = 'Please enter your password :';
        super([text]);
        this.password = '3157';
        this.mainStrLength = text.length;
        this.btnBlock = window.document.createElement('div');
        this.btnBlock.style.position = 'absolute';
        this.btnBlock.style.left = '33%';
        this.btnBlock.style.bottom = '10vh';
        this.btnBlock.style.width = '33%';
        this.block.appendChild(this.btnBlock);
        this.skipButton.innerText = 'Clear';
        this.nextButton.innerText = 'Enter';
        this.createNumButtons();
        this.skipButton.onclick = () => {
            if(this.p.innerText.length > this.mainStrLength){
                let str = '';
                for(let i = 0; i < this.p.innerText.length - 1; i++){
                    str += this.p.innerText[i];
                }
                this.p.innerText = str;
            }
        }
        this.nextButton.onclick = () => {
            if(this.p.innerText.length === this.mainStrLength + 4){
                let str = '';
                for(let i = this.p.innerText.length - 4; i < this.p.innerText.length; i++){
                    str += this.p.innerText[i];
                }
                if(str === this.password){
                    this.block.style.display = 'none';
                    finalTimerText.innerText = 'You win!';
                    imgBlock.style.display = 'none';
                }else{
                    this.p.innerText = 'The password is incorrect, try again:';
                    this.mainStrLength = this.p.innerText.length;
                }
            }
        }
    }
    createNumButtons(){
        for(let i = 1; i <= 9; i++){
            let btn = window.document.createElement('button');
            this.setButtonStyle(btn, `${i}`);
            btn.style.left =
                (i <= 3)
                    ? `${(i - 1)*33}%`
                    : (i <= 6)
                        ? `${(i - 4)*33}%`
                        : `${(i - 7)*33}%`
            ;
            btn.style.bottom =
                (i <= 3)
                    ? '36vh'
                    : (i <= 6)
                        ? '18vh'
                        : 0
            ;
            btn.onclick = (event) => {
                if(this.p.innerText.length < this.mainStrLength + 4){
                    this.p.innerText += event.target.innerText;
                }
            }
            this.btnBlock.appendChild(btn);
        }
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
    lives;
    message;
    isLast

    sourcePath;
    constructor(x,y, src, message = '', isLast =  false) {
        this.isLast = isLast;
        this.message = message;
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
                    if (this.message) {
                        new Cutscene([this.message]);
                        if(this.isLast) {
                            new Lever();
                        }
                    }
                    return;
                }
            }
            this.img.style.left = `${-(this.spritePos*this.blockSize)}px`;
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
    constructor(x,y,mess) {
        super(x,y, 'images/enemies/1/', mess);
    }
}
class Enemy2 extends Enemy {
    constructor(x,y,mess) {
        super(x,y, 'images/enemies/2/',mess);
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
    constructor(x,y,mess, isLast) {
        super(x,y, 'images/enemies/3/',mess, isLast);
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
class Enemy5 extends Enemy {
    constructor(x,y,mess, isLast) {
        super(x,y, 'images/enemies/5/',mess, isLast);
    }
    setWalk(){
        this.img.src = this.sourcePath+'main.png';
        // this.img.style.width = '98px';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setAttack(){
        this.img.src = this.sourcePath+'mainatt.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setHurt(){
        this.img.src = this.sourcePath+'mainhut.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
    }
    setDeath(){
        this.img.src = this.sourcePath+'maindeath.png';
        this.img.style.top = `0px`;
        this.img.style.height = '98px';
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
    if(lives<=0) {
        if (heroY<0){
            finalTimerText.innerText = 'You fell\nGame Over';
            imgBlock.style.display = 'none';
        } else {
            finalTimerText.innerText = 'Game Over';
            imgBlock.style.display = 'none';
        }

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

    //Fountain
    createImgEl(basePath + 'Fountain/2.png', 116, f1);
    //Box
    createImgEl(basePath + '/Other/Box.png', 84, f1);
    createImgEl(basePath + '/Other/Box.png', 50, f1);
    createImgEl(basePath + '/Other/Box.png', 14, f3);
    createImgEl(basePath + '/Other/Box.png', 64, f2);
}
const addEnemies = () => {
    let ememy1 = new Enemy1(5,10, 'First digit of the code 3');
    let ememy2 = new Enemy2(14,5);
    let ememy3 = new Enemy3(52,10);
    let ememy4 = new Enemy1(61,5, 'last digit of the code 7.');
    let ememy5 = new Enemy3(90,5);
    let ememy6 = new Enemy2(75,10, 'Second digit of the code 1');
    let ememy7 = new Enemy3(75,1, 'Third digit of the code 5.', );
    let ememy8 = new Enemy5(98,10, 'Take the crystal.', true);


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
                    jumpHandler();
                }else if (event.code === 'KeyE') {
                    hit = true;
                    hitHandler();
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
const addStartScreen = () => {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = 0;
    div.style.bottom = 0;
    div.style.width = '100%';
    div.style.height = '100vh';
    div.style.backgroundColor = '#38002c';
    div.style.display = 'grid';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    canvas.appendChild(div);
    let btn = window.document.createElement('button');
    btn.innerText = 'PLAY';
    btn.style.fontFamily = "'Press Start 2P', cursive";
    btn.style.fontSize = '30pt';
    btn.style.backgroundColor = '#8babbf';
    btn.style.color = '#38002c';
    btn.style.padding = '20pt 30pt';
    btn.style.border = 'none';
    btn.addEventListener('click', () => {
        div.style.display = 'none';
        fsBtn.src = 'images/screen/cancel.png';
        canvas.requestFullscreen();
        let cutscene = new Cutscene([
            "Adam landed on an alien planet.\n\n It turned out that escaping from this world was possible – the door was located behind one of the fountains at the end of the first level.\n\n However, to open it, he needed to find a hidden lever and enter the password code.",
            " \n\n The password consists of 4 numbers.\n\n The digits of the password are inside carefully guarded wooden crates (one in each).\n\n As for the lever, it is hidden on the second level, which Adam doesn't have access to. \n\n Fortunately, his friends found a way to steal it.\n\n",
            " But, since the danger is too great, they will only hand over the lever when all the digits of the password are known.\n\n When the lever appears, Adam will have 30 seconds to find it, run to the fountain, and enter the password.\n\n If the hero fails – the location of his friends will be discovered by adversaries.",
        ]);
    });
    div.appendChild(btn);
}

// Начать анимацию
const start = () => {
    addHearts();
    updateHearts();
    addBackgroundImages();
    buildLevel();
    addStartScreen();


    lifeCycle();
}

start();

