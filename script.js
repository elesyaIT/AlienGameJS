// Variables
let  heroImg = document.querySelector('#hero-img');
let  imgBlock = document.querySelector('#img-block');
let rightPosition = 0;
let imgBlockPosition = 0;

let lastTime = 0;
const delay = 70; // Задержка в миллисекундах


//Function

// перемещение блока
const updatePositions = () => {
    heroImg.style.left = `-${rightPosition * 288}px`;
    imgBlock.style.left = `${imgBlockPosition * 20}px`;
};

// на право
const rightHandler = () => {
    heroImg.style.transform='scale(-1,1)';
    rightPosition +=1;
    imgBlockPosition +=1;
    if(rightPosition>5){
        rightPosition=0;
    }
    updatePositions();
}

// на лево
const leftHandler = () => {
    heroImg.style.transform='scale(1,1)';
    rightPosition +=1;
    imgBlockPosition -=1;
    if(rightPosition>5){
        rightPosition=0;
    }
    if (imgBlockPosition < 0) {
        imgBlockPosition = 0;
    }
    updatePositions();
}

//Handlers
let isMoving = false;

window.addEventListener('keydown', (event)=>{
    if (!event.repeat && !isMoving) {
        isMoving=true;

        function move() {
            const currentTime = new Date().getTime();
            if (currentTime - lastTime > delay) {
                if (event.code === 'KeyD') {
                    rightHandler();
                } else if (event.code === 'KeyA') {
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
})

window.addEventListener('keyup', () => {
    isMoving = false;
})
