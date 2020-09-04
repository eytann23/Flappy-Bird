let canvas = document.querySelector("canvas");
let c=canvas.getContext('2d');





class gameComponent{
    constructor (height,width,locationX,locationY,img){
        this.width = width;
        this.height = height;
        this.locationX = locationX;
        this.locationY = locationY;
        this.img=img;
        this.speedX = 0;


        this.update = function() {
            c.drawImage(this.img,this.locationX,this.locationY,this.width,this.height);
        }
    }
}
//Bird
class Bird extends gameComponent{
    constructor(height,width,locationX,locationY,img){
        super (height,width,locationX,locationY,img);
        this.gravity=0.15;
        this.gravitySpeed=0;

        this.lastFrameCounter=0;
        this.lastFlyUpLocationY=0;
        this.angle=0;

        this.newPos = function() {
            this.gravitySpeed+=this.gravity;
            this.locationY+=this.gravitySpeed;
            this.touchFloor();
        }
        this.update = function() {
            //turn down
            if (this.lastFlyUpLocationY<=this.locationY && this.angle!==90)
            {
                const addToLocationX=this.angle<0?0:((this.angle)/3)*2;
                let floorHeight = canvas.height - this.height-90;// instead of 90 => floor locationY
                if (this.locationY == floorHeight) {
                    this.lastFrameCounter=-1;
                    const addToLocationY=this.angle<0?10:-3;
                    this.flyingUpAnimation(this.lastFrameCounter,this.angle,this.locationX+addToLocationX,this.locationY+addToLocationY,this.width,this.height);
                }else{
                    this.angle+=3;
                    this.flyingUpAnimation(this.lastFrameCounter,this.angle,this.locationX+addToLocationX,this.locationY,this.width,this.height);
                    this.lastFrameCounter=(this.lastFrameCounter+1)%24;
                }                
            }
            //fly up    
            if(this.lastFlyUpLocationY>this.locationY){
                this.angle=-30;
                this.flyingUpAnimation(this.lastFrameCounter,this.angle,this.locationX,this.locationY,this.width,this.height);
                this.lastFrameCounter=(this.lastFrameCounter+1)%24;
            }
            //free fall
            if (this.angle===90){
                this.flyingUpAnimation(8,this.angle,this.locationX+60,this.locationY,this.width,this.height);//8=lead to flat
            }
                
        }
        this.flyUp=function(){
            this.gravitySpeed=-5;
            this.lastFlyUpLocationY=this.locationY;
        }
        this.touchFloor = function() {//this function need to be out of this class
            let floorHeight = canvas.height - this.height-90;// instead of 90 => floor locationY
            if (this.locationY > floorHeight) {
                this.locationY = floorHeight;
            }
        }
        this.flyingUpAnimation=function(lastFrame,angle,locationX,locationY,width,height){
            const birdFlat=document.createElement('img');
            birdFlat.src="./sources/bird-flat.png";
            const birdUp=document.createElement('img');
            birdUp.src='./sources/wing-up.png';
            const birdDown=document.createElement('img');
            birdDown.src='./sources/wing-down.png';
            c.save();
            c.translate(locationX,locationY);
            c.rotate(angle*Math.PI/180);
                switch(Math.floor(lastFrame/8)) {
                    case 0:
                        c.drawImage(birdDown,0,0,width,height);
                      break;
                    case 1:
                        c.drawImage(birdFlat,0,0,width,height);
                      break;
                    case 2:
                        c.drawImage(birdUp,0,0,width,height);
                      break;
                    default:
                        c.drawImage(birdFlat,0,0,width,height);
                        break;
                  }
            c.restore();
        }
        this.direction=true;
        this.newStartAnimation=function(){
            const birdFlat=document.createElement('img');
            birdFlat.src="./sources/bird-flat.png";
            const topBorder=270;
            const bottomBorder=290;
            
            if (this.locationY===topBorder || this.locationY===bottomBorder){
                this.direction=!this.direction;
            }
            if(this.direction)
                this.locationY+=0.5;
            else
                this.locationY-=0.5;

            c.drawImage(birdFlat,this.locationX,this.locationY,this.width,this.height);
            
            
        }
        
    }
    
}
//Pipe
class Pipe extends gameComponent{
    constructor(height,width,locationX,locationY,imgSrc){
        super (height,width,locationX,locationY);
        this.speedX=2;//test
        this.img= document.createElement("img");
        this.img.src=imgSrc;
        
        this.newPos = function() {
            this.locationX-=this.speedX;
        }
    }
    
}
function pairOfPipes(spaceBetweenPipes ,spaceBetweenPairs=0){
    let space=spaceBetweenPipes;
    const pipeEnd=40;
    const pipeHeight=500;
    const bottomPipeY=getRandomPipeHeight();
    const bottomPipeImgSrc="./sources/bottom-pipe.png";
    const topPipeImgSrc="./sources/top-pipe.png";
    let bottomPipe=new Pipe(pipeHeight,90,canvas.width+spaceBetweenPairs,bottomPipeY,bottomPipeImgSrc);
    const topPipeY=bottomPipeY-space-pipeHeight;
    let topPipe=new Pipe(pipeHeight,90,canvas.width+spaceBetweenPairs,topPipeY,topPipeImgSrc);

    this.newPos=function () {
        bottomPipe.newPos();
        topPipe.newPos();

        if (bottomPipe.locationX+bottomPipe.width<0){
            bottomPipe.locationX=canvas.width;
            topPipe.locationX=canvas.width;
            bottomPipe.locationY=getRandomPipeHeight();
            topPipe.locationY=bottomPipe.locationY-space-pipeHeight;
        }
        
    },
    this.update=function () {
        bottomPipe.update();
        topPipe.update();
    },
    this.getBottomPipeY=function(){
        return bottomPipe.locationY;
    },
    this.getSpaceBetweenPipes=function(){
        return space;
    },
    this.getLocationX=function(){
        return bottomPipe.locationX;
    },
    this.getPipeWidth=function(){
        return bottomPipe.width;
    }
    this.setSpaceBetweenPipes=function(newSpace){
        space=parseInt(newSpace);
    }
    function getRandomPipeHeight(){
        let height=Math.floor(Math.random() *(canvas.height-90-space-pipeEnd*2) ) + (space+pipeEnd);//90=floor.locationY
        return height;
    }
}
//Floor
class FloorPart extends gameComponent{
    constructor(height,width,locationX,locationY){
        super (height,width,locationX,locationY);
        this.speedX=2;//test
        this.img= document.createElement("img");
        this.img.src="./sources/floor.png";
        
        this.newPos = function() {
            this.locationX-=this.speedX;
            if (this.locationX===-this.width){
                this.locationX=canvas.width;//canvas in global scope
            }
        }
        
    }
}
function continuousFloor(){
    const floorPartOne=new FloorPart(200,canvas.width,canvas.width,canvas.height-90);//90 is the "floor height"
    const floorPartTwo=new FloorPart(200,canvas.width,0,canvas.height-90);

    this.newPos=function () {
        floorPartOne.newPos();
        floorPartTwo.newPos();
    },
    this.update=function () {
        floorPartOne.update();
        floorPartTwo.update();
    },
    this.getFloorY=function(){
        return floorPartOne.locationY;
    }
}

//Difficulty
function difficultyLevels(){
    this.buttons=document.getElementsByClassName('difficulty-button');
    this.selectedLevel=2;
    for (let b of this.buttons){
            b.addEventListener('click',()=>{
                this.resetLevelsButtons(this.buttons);
                this.selectedLevel=b.id;
                
            b.classList.add('difficulty-selection');

        });

    }
    this.getSpace=function(){
        // console.log(this.selectedLevel);
        switch (parseInt(this.selectedLevel)){
            case 1:
                return (200);
            case 2:
                return (170);
            case 3:
                return (150);
        };
    }
    this.resetLevelsButtons=function(){
        for(let button of this.buttons){
            button.classList.remove('difficulty-selection');
        }
    }
    this.disableLevelsButtons=function(){
        for(let button of this.buttons){
            button.disabled=true;
        }
    }
    this.enableLevelsButtons=function() {
        for(let button of this.buttons){
            button.disabled=false;
        }
    }
    this.getCurrentDifficultyLevel=function(){

        return parseInt(this.selectedLevel);
    }
}









function flappyBirdGame(){
    let bird=new Bird(40,55,150,100);
    let floor=new continuousFloor();
    let firstPipesPair=new pairOfPipes(200);
    let secondPipesPair=new pairOfPipes(200,280);
    let status=new gameStatus();
    const difficulty=new difficultyLevels();

    function startInterval(){
        c.clearRect(0,0,canvas.width,canvas.height);
        bird.newStartAnimation();
        floor.newPos();
        floor.update();
        drawScore(0);
    }
    function firstUserEvent(event){
        event.preventDefault();
        if (event.which===32){
            difficulty.disableLevelsButtons();
            gameState.play();
        }
            
        if(event.clientX<=canvas.width &&event.clientY<=canvas.height){
            difficulty.disableLevelsButtons();
            gameState.play();
        }
            
    }
    function startNewGame(event) {
        event.preventDefault();
        if (event.which===32){
            gameState.init();
        }

        if (event.clientX>=185&&event.clientX<=312
            &&event.clientY>=351&&event.clientY<=390){
            gameState.init();
        }
        
    }
    function flyOnLeftClick(event){
        if(event.clientX<=canvas.width &&event.clientY<=canvas.height)
            bird.flyUp();
    }
    function flyOnSpace(event) {
        event.preventDefault();
        if (event.which===32)
            bird.flyUp();
    }
    
    function autoFly(bird,firstPipesPair,secondPipesPair){
        let firstPassY=firstPipesPair.getBottomPipeY()-bird.height-50;
        let secondPassY=secondPipesPair.getBottomPipeY()-bird.height-50;
        bird.gravity=0;
        bird.angle=-30;
        if (firstPipesPair.getLocationX()>bird.locationX && firstPipesPair.getLocationX()-bird.locationX<250){
            
            if(bird.locationY>firstPassY){
                if (bird.locationY-firstPassY<6){
                    bird.locationY=firstPassY;
                   return;
               }
               bird.locationY-=8;

            }
               
            if(bird.locationY<firstPassY){
                if (firstPassY-bird.locationY<6){
                    bird.locationY=firstPassY;
                    return;
                }
                bird.locationY+=8;
            }
        }
        if (bird.locationX>=firstPipesPair.getLocationX() && bird.locationX<=firstPipesPair.getLocationX()+firstPipesPair.getPipeWidth()){
            bird.locationY=firstPassY;
        }

        if (secondPipesPair.getLocationX()>bird.locationX && secondPipesPair.getLocationX()-bird.locationX<250){
            
            if(bird.locationY>secondPassY){
                if (bird.locationY-secondPassY<6){
                    bird.locationY=secondPassY;
                   return;
               }
               bird.locationY-=8;

            }
               
            if(bird.locationY<secondPassY){
                if (secondPassY-bird.locationY<6){
                    bird.locationY=secondPassY;
                    return;
                }
                bird.locationY+=8;
            }
        }
        if (bird.locationX>=secondPipesPair.getLocationX() && bird.locationX<=secondPipesPair.getLocationX()+secondPipesPair.getPipeWidth()){
            bird.locationY=secondPassY;
        }
    }
    function updateGame() {
        c.clearRect(0,0,canvas.width,canvas.height);
        bird.newPos();
        bird.update();
        firstPipesPair.update();
        secondPipesPair.update();
        floor.update();
        firstPipesPair.newPos();
        secondPipesPair.newPos();
        floor.newPos();
        
        //autoFly(bird,firstPipesPair,secondPipesPair);



        status.addPoint(bird,firstPipesPair,secondPipesPair);
        // if (status.points===0){
        //     firstPipesPair.setSpaceBetweenPipes(260);
        //     secondPipesPair.setSpaceBetweenPipes(260);
        // }
        // if (status.points===10){
        //     firstPipesPair.setSpaceBetweenPipes(180);
        //     secondPipesPair.setSpaceBetweenPipes(180);
        // }
        // if (status.points===20){
        //     firstPipesPair.setSpaceBetweenPipes(130);
        //     secondPipesPair.setSpaceBetweenPipes(130);
        // }
        drawScore(status.points);
        

        if(!status.isGameOver){
            if(isGameOver(bird,firstPipesPair,floor)||isGameOver(bird,secondPipesPair,floor)){
                bird.gravitySpeed=2;
                status.isGameOver=true;
                gameState.freeze();   
            }
        }
        
            
    }
    function endOfGame(){
        c.clearRect(0,0,canvas.width,canvas.height);
        
            firstPipesPair.update();
            secondPipesPair.update();
            bird.newPos();
            bird.update();
            floor.update();

            drawGameConclusion(status.points,status.bestScore);
            drawRestartButton();

            if(isBirdTouchedFloor(bird.locationY,bird.height,floor.getFloorY())){
                gameState.end();
            }
                
            
                
            

                
        
    }

    //Status
    function gameStatus(bestScore=0,currentDifficultyLevel=2,lastDifficultyLevel){
        this.points=0;
        this.isGameOver=false;
        this.lastDifficultyLevel=lastDifficultyLevel;
        this.currentDifficultyLevel=currentDifficultyLevel;
        if (this.currentDifficultyLevel===this.lastDifficultyLevel)
            this.bestScore=bestScore;
        else
            this.bestScore=0;
        
        this.lastDifficultyLevel=this.currentDifficultyLevel;

        this.addPoint=function(bird,firstPipesPair,secondPipesPair){
            if(isBirdBackBetweenPipesEdgesX(bird.locationX,firstPipesPair.getLocationX(),firstPipesPair.getPipeWidth())){
                if(firstPipesPair.getLocationX()===150)
                    this.points++;
            }
            if(isBirdBackBetweenPipesEdgesX(bird.locationX,secondPipesPair.getLocationX(),secondPipesPair.getPipeWidth())){
                if(secondPipesPair.getLocationX()===150)
                    this.points++;
            }

            if(this.points>this.bestScore)
                this.bestScore=this.points;
        }

    }
    //Score
    function getNumberImg(digit){
        const numberImg=document.createElement('img');
        numberImg.src= `./sources/number${digit}.png`;
        return numberImg;
    }
    function drawScore(number=9032412){
        const numbersArray=number.toString().split('');
        const y=80;
        const height=52;
        const width=35;
        const spaceBetweenNumbers=6;
        let currentX=(canvas.width/2)-((width+spaceBetweenNumbers)/2)*(numbersArray.length);
        for(let digit of numbersArray){
            let numberImg=getNumberImg(digit);
            c.drawImage(numberImg,currentX,y,width,height);

            currentX+=width+spaceBetweenNumbers;
            currentX-=digit==1?5:0;
        }

        //digitObjectsArray.map(digitObj=>digitObj.update());

    }
    function drawGameConclusion(score,best){
        const conclusionWindowImg=document.createElement('img');
        conclusionWindowImg.src= `./sources/score-best.png`;
        c.drawImage(conclusionWindowImg,176,140,128,163);
        
        const scoreDigitsArray=score.toString().split('');
        const bestDigitsArray=best.toString().split('');
        const scoreY=185;
        const bestY=245;
        const height=32;
        const width=20;
        const spaceBetweenNumbers=6;
        const scoreX=3+(canvas.width/2)-((width+spaceBetweenNumbers)/2)*(scoreDigitsArray.length);
        const bestX=3+(canvas.width/2)-((width+spaceBetweenNumbers)/2)*(bestDigitsArray.length);

        drawNumber(score,scoreX,scoreY,width,height);
        drawNumber(best,bestX,bestY,width,height);
    }
    function drawNumber(number,x,y,width,height){
            const numbersArray=number.toString().split('');
            const spaceBetweenNumbers=6;
            let currentX=x;
            for(let digit of numbersArray){
                let numberImg=getNumberImg(digit);
                c.drawImage(numberImg,currentX,y,width,height);
                currentX+=width+spaceBetweenNumbers;
                currentX-=digit==1?5:0;
            }
    }
    function drawRestartButton(){
        const restartButtonImg=document.createElement('img');
        restartButtonImg.src='./sources/restart.png';
        c.drawImage(restartButtonImg,175,340,130,45);
    }
    //isGameOver
    function isGameOver(bird,pipes,floor){
        const birdX = bird.locationX;
        const birdY = bird.locationY;
        const birdWidth = bird.width;
        const birdHeight = bird.height;
        const pipesX = pipes.getLocationX();
        const bottomPipeY = pipes.getBottomPipeY();
        const spaceBetweenPipes = pipes.getSpaceBetweenPipes();
        const floorY = floor.getFloorY();
        const pipeWidth = pipes.getPipeWidth();

        if(isBirdTouchedPipe(birdX,birdY,pipesX,bottomPipeY,spaceBetweenPipes,pipeWidth,birdWidth,birdHeight)){
            console.log('touched pipe');//temp
            return true;
        }
        if (isBirdTouchedFloor(birdY,birdHeight,floorY)){
            console.log('touched floor');//temp
            return true;
        }

        return false;
    }
    function isBirdFrontBetweenPipesEdgesX(birdX,pipesX,pipeWidth,birdWidth){
        if((birdX+birdWidth>=pipesX&&birdX+birdWidth<=pipesX+pipeWidth))
            return true;
    }
    function isBirdBackBetweenPipesEdgesX(birdX,pipesX,pipeWidth){
        if (birdX>=pipesX&&birdX<=pipesX+pipeWidth)
            return true;
    }
    function isBirdTouchedPipe(birdX,birdY,pipesX,bottomPipeY,spaceBetweenPipes,pipeWidth,birdWidth,birdHeight){
        if(isBirdFrontBetweenPipesEdgesX(birdX,pipesX,pipeWidth,birdWidth)){
            if(birdY-15<bottomPipeY-spaceBetweenPipes){
                console.log('1');
                return true;
            }
            if(birdY+birdHeight-10>bottomPipeY){
                console.log('2');
                return true;
            } 
        }
        if(isBirdBackBetweenPipesEdgesX(birdX,pipesX,pipeWidth)){
            if(birdY-12<bottomPipeY-spaceBetweenPipes){
                console.log('3');
                return true;
            }   
            if (birdY+birdHeight-15>bottomPipeY){
                console.log('4');
                return true;
            }
        }
    }
    function isBirdTouchedFloor(birdY,birdHeight,floorY){
        if (birdY+birdHeight+10>floorY)
            return true;
        else
            return false;
    }



    const gameState={

        init: function() {
            //end previous game
            clearInterval(this.endInterval);
            window.removeEventListener('click',startNewGame);
            window.removeEventListener('keydown',startNewGame);
            
            bird=new Bird(40,55,150,280);
            floor=new continuousFloor();
            
            //waiting for user
            difficulty.enableLevelsButtons();
            this.beginningInterval=setInterval(startInterval,10);
            window.addEventListener('click',firstUserEvent);
            window.addEventListener("keydown",firstUserEvent);

            //fly boost events
            window.addEventListener('click',flyOnLeftClick);
            window.addEventListener("keydown", flyOnSpace);

                
        },
        play: function(){
            status=new gameStatus(status.bestScore,difficulty.getCurrentDifficultyLevel(),status.lastDifficultyLevel);
            let spaceBetweenPipes=difficulty.getSpace();
            
            firstPipesPair=new pairOfPipes(spaceBetweenPipes);
            secondPipesPair=new pairOfPipes(spaceBetweenPipes,280);
            

            clearInterval(this.beginningInterval);
            window.removeEventListener("click",firstUserEvent);
            window.removeEventListener("keydown",firstUserEvent);
            window.addEventListener('click',flyOnLeftClick);
            window.addEventListener("keydown", flyOnSpace);
            this.gameInterval = setInterval(updateGame,10);
        },
        freeze: function(){
            
            //cancel jump
            window.removeEventListener('click',flyOnLeftClick);
            window.removeEventListener('keydown',flyOnSpace);
            clearInterval(this.gameInterval);
            this.endInterval=setInterval(endOfGame,10);     
        },
        end: function(){
            window.addEventListener('click',startNewGame);
            window.addEventListener('keydown',startNewGame);
            
        }    
    }


    this.start=function(){gameState.init()} ;
}

const flappyGame=new flappyBirdGame();
flappyGame.start();