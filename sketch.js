//sound effects
let loseSound;
let leverSound;

//objects used in game
let ball;
let obstacles;
let leftLever;
let rightLever;
var score = 0;

//constant used for gravity
var gravity = 0.5;

//loading sound effects
function preload(){
  loseSound = loadSound('losesound.mp3');
  leverSound = loadSound('leversound.mp3');
}

function setup() {
  createCanvas(600,700);
  
  //ball initially has no movement, halfway through screen and radius 20.
  ball = new Sprite(width/2, 100, 40,40);
  ball.color = color(145,201,255);
  ball.r = 20;
  ball.vel.x = 0;
  ball.vel.y = 0;
  
  //placing each obstacle, may be different sizes
  obstacles = new Group();
  let obstaclePosition = [
    {x:270,y:270,r:40},
    {x:150,y:350,r:30},
    {x:450,y:300, r:30}
  ];
  for(var obs of obstaclePosition){
    let o = new obstacles.Sprite(obs.x, obs.y, obs.r * 2, obs.r * 2);
    o.r = obs.r;
    o.color = color(226,238,235);
  }
  
  //where each lever is, size, angle + angle we want to be at
  leftLever = {x:170,y:600,w:210,h:20,angle:0,targetAngle:0};
  rightLever = {x:430,y:600,w:210,h:20,angle:0,targetAngle:0};
}

function draw() {
  background(30,30,50);
  
  //changing the angle of each lever when keys are pressed
  //A is down, change left
  if(keyIsDown(65)){
    leftLever.targetAngle = 60;
  }
  else{
    leftLever.targetAngle = 0;
  }
  //D is down, change right
  if(keyIsDown(68)){
    rightLever.targetAngle = -60;
  }
  else{
    rightLever.targetAngle = 0;
  }
  
  //smooth movement using lerp
  leftLever.angle = lerp(leftLever.angle, leftLever.targetAngle, 0.4);
  rightLever.angle = lerp(rightLever.angle, rightLever.targetAngle, 0.4);
  
  //push/pop means only flipper is rotated, not other elements!!
  push();
  //origin for rotation is where the lever is
  translate(leftLever.x, leftLever.y);
  rotate(leftLever.angle);
  //rectangle is centred on the lever when drawn
  rectMode(CENTER);
  fill(175,210,245);
  rect(0,0,leftLever.w, leftLever.h, 5);
  pop();
  
  //push/pop means only flipper is rotated, not other elements!!
  push();
  //origin for rotation is where the lever is
  translate(rightLever.x, rightLever.y);
  rotate(rightLever.angle);
  //rectangle is centred on the lever when drawn
  rectMode(CENTER);
  fill(175,210,245);
  rect(0,0,rightLever.w, rightLever.h, 5);
  pop();
  
  //gravity added to the velocity downwards, change velocity also
  ball.vel.y += gravity;
  ball.x += ball.vel.x;
  ball.y += ball.vel.y;
  
  //the ball should bounce off the edges of the canvas, not go through it
  //too far left off screen, reverse the x velocity
  if(ball.x < ball.r){
    ball.x = ball.r;
    ball.vel.x *= -1;
  }
  //too far right off screen, reverse the x velocity
  if(ball.x > width - ball.r){
    ball.x = width - ball.r;
    ball.vel.x *= -1;
  }
  //too far up! reverse y velocity this time
  if(ball.y < ball.r){
    ball.y = ball.r;
    ball.vel.y *= -1;
  }
  
  //if it collides with the levers, go up instead, increase score
  //change position so ball doesn't get stuck
  //this checks collision with all edges of rectangle for lever
  if (ball.y + ball.r > leftLever.y - leftLever.h/2 &&
      ball.y - ball.r < leftLever.y + leftLever.h/2 &&
      ball.x > leftLever.x - leftLever.w/2 &&
      ball.x < leftLever.x + leftLever.w/2)
  {
        score+=5;
        ball.vel.y *= -1.2;
        ball.y = leftLever.y - leftLever.h/2 - ball.r;
        leverSound.play();
  }
  if (ball.y + ball.r > rightLever.y - rightLever.h/2 &&
      ball.y - ball.r < rightLever.y + rightLever.h/2 &&
      ball.x > rightLever.x - rightLever.w/2 &&
      ball.x < rightLever.x + rightLever.w/2)
  {
        score += 5;
        ball.vel.y *= -1.2;
        ball.y = rightLever.y - rightLever.h/2 - ball.r;
        if (!leverSound.isPlaying()) {
          leverSound.play();
        }
  }
  
  //if it collides with obstacle, moves away depending on angle between
  for(var obs of obstacles){
    var d = dist(ball.x, ball.y, obs.x, obs.y);
    if (d < ball.r + obs.r){
      var angle = atan2(ball.y - obs.y, ball.x - obs.x); //angle from the obstacle to ball, since angleTo() wasn't working well.
      ball.vel.x = cos(angle) *5;
      ball.vel.y = sin(angle) *5;
      //score += 5;
    }
  }
  
  //if ball falls below levers (bottom of screen), reset
  if(ball.y > height + ball.r){
    ball.x = width/2;
    ball.y = 100;
    ball.vel.x = 0;
    ball.vel.y = 0;
    score = 0;
    loseSound.play();
  }
  
  //add ball to screen
  fill(119,186,255);
  ellipse(ball.x, ball.y, ball.r*2);
  
  //adding the obstacles
  fill(50,200,255)
  for(var i = 0; i <3; i++){
    ellipse(obstacles[i].x, obstacles[i].y, obstacles[i].r*2);
  }
  
  //adding text to screen
  fill(255);
  textSize(30);
  text("Score: " + score, 20,50);
  textSize(15);
  text("*Use A and D to control levers*", 20, height-20);
  
}