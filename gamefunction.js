console.log("working");

// Wrap every letter in a span
let textWrapper = document.querySelector('.loadtext');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
//setting up loading text animation
anime.timeline({loop: true})
  .add({
    targets: '.loadtext .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.loadtext',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

//declaring global letiables
const canvas= document.getElementById("brickCanvas");
const ctx= canvas.getContext("2d");
let currentScore=0;
let canvasWidth=750;
let canvasHeight=500;
let timer=1;
let canvasX=canvas.offsetLeft;

//ball specifiations
let ballx= canvasWidth/2-10;
let bally= canvasHeight/2;
let ballSpeedx = 0;
let ballSpeedy= 0;
const ballRadius=10;

//paddle specifiations
let paddleHeight = 10;
let paddleWidth = 0;
let paddleX = (canvas.width-paddleWidth) / 2;

//brick specifications
let brickWidth=70;
let brickHeight=15;
let brickPadding=5;
let brickRow= 10;
let brickColumn=10;

//making 2D array of bricks and initializing with position object
let bricks=[];
for( let c=0;c<brickColumn;c++){
  bricks[c]=[];
  for(let r=0;r<brickRow;r++){
    bricks[c][r]={x:0,y:0, show:1};
  }
}

//entrypoint
function setGame(x,y){
  paddleWidth=y;
  ballSpeedx=x;
  ballSpeedy=x;
  plasound();
  draw();
}


//to draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
}

//to draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

//to draw bricks
function drawBricks(){
  for( let c=0;c<brickColumn;c++){
    for(let r=0;r<brickRow;r++){
      if(bricks[c][r].show==1){
        let brickX=c*(brickWidth+brickPadding);
        let brickY=r*(brickHeight+brickPadding);
        bricks[c][r].x=brickX;
        bricks[c][r].y=brickY;
        ctx.beginPath();
        ctx.rect(brickX,brickY,brickWidth,brickHeight);
        ctx.fillStyle="black";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//function to update gamescreen
//driver program
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  brickCollision();
  wallCollision();
  paddleMovement();
  scoreUpdate();
  ballx += ballSpeedx;
  bally += ballSpeedy;
  if(timer==1){
    setTimeout(timerF,1500)
  }
  else{
    requestAnimationFrame(draw);
  }
}
function timerF(){
  timer=0;
  draw();
}

//function to check collision with wall
function wallCollision(){
  if(ballx + ballSpeedx > canvas.width-ballRadius || ballx + ballSpeedx < ballRadius) {
  ballSpeedx = -ballSpeedx;
  }
  else if (bally + ballSpeedy < ballRadius) {
      ballSpeedy = -ballSpeedy;
  }
  else if (bally + ballSpeedy> canvas.height-ballRadius){
    if(ballx>paddleX  && ballx<paddleX+paddleWidth){
      ballSpeedy = -ballSpeedy;
    }
    else{
      bally=canvas.height+100;
      window.cancelAnimationFrame(draw);
      document.getElementById("gameover").style.display="block";
    }
  }
}

//function to check collision with bricks
function brickCollision(){
  for( let c=0;c<brickColumn;c++){
    for(let r=0;r<brickRow;r++){
      let temp=bricks[c][r];
      if(temp.show==1){
        if((ballx>temp.x) && (ballx<temp.x+brickWidth) && (bally>temp.y) && (bally<temp.y+brickHeight)){
          ballSpeedy = -ballSpeedy;
          temp.show=0;
          currentScore++;
          if(currentScore==brickRow*brickColumn){
            window.cancelAnimationFrame(draw);
            document.getElementById("winner").style.display="block";
          }
        }
      }
    }
  }
}

//paddle movement according to left and right arrow key
let leftKey=false;
let rightKey=false;

document.addEventListener("keydown",keyDown);
document.addEventListener("keyup",keyUp);

function keyDown(event){
  if(event.key=="Right"|| event.key=="ArrowRight"){
    rightKey=true;
  }
  else if(event.key=="Left"|| event.key=="ArrowLeft"){
    leftKey=true;
  }
}
function keyUp(event){
  if(event.key=="Right"|| event.key=="ArrowRight"){
    rightKey=false;
  }
  else if(event.key=="Left"|| event.key=="ArrowLeft"){
    leftKey=false;
  }
}

function paddleMovement(){
  if(rightKey){
    paddleX += 9;
     if (paddleX + paddleWidth > canvas.width){
         paddleX = canvas.width - paddleWidth;
     }
  }
  if(leftKey){
    paddleX-=9;
    if(paddleX<0){
      paddleX=0;
    }
  }
}

//setting up paddle movement according to mouse
document.addEventListener("mousemove",mouseMove);
function mouseMove(e){
  let mouseX=e.clientX;
  if(mouseX> canvasX&& mouseX< canvasX+canvas.width){
    paddleX=mouseX-canvasX;
  }
}

//utility functions
function scoreUpdate(){
  document.getElementById("score").innerHTML=" Score: "+currentScore;
}
function reload(){
  document.location.reload();
}
//background sound
function plasound(){
  const backsound=new Audio();
  backsound.src="music/backsound.mp3";
  backsound.loop=true;
  backsound.play();
}
