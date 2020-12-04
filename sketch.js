//Create variables here
var dog,happydog;
var foodS,foodstock;
var dogimg,dogimg2;
var milk,milkimg;
var database;
var lastfed,fedTime;
var washroomimg;

function preload()
{
  //load images here
  dogimg=loadImage("images/dogImg.png");
  dogimg2=loadImage("images/dogImg1.png");
  milkimg=loadImage("images/Milk.png");
  gardenimg=loadImage("virtual pet images/Garden.png");
  washroomimg=loadImage("virtual pet images/Wash Room.png");
}

function setup() {
  createCanvas(1000, 500);
  database=firebase.database();
  dog=createSprite(500,250,50,50);
  dog.addImage(dogimg);
  dog.scale=0.25;
  feed=createButton("Feed the dog");
  feed.position(900,100);
  feed.mousePressed(feedDog);
  addfood=createButton("Add food");
  addfood.position(800,100);
  addfood.mousePressed(getfood);
  foodstock=database.ref('Food');
  foodstock.on("value",readStock);
}


function draw() {  
  background(46,139,87);
  currentTime=hour();
  if(currentTime===lastfed){
    dog.addImage(gardenimg);
    updateState("garden");
  }

  if(currentTime>lastfed+2&&currentTime<lastfed+4){
    dog.addImage(washroomimg);
    updateState("bathing");
  }

  var x=80;
  var y=100;
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogimg2);
  }
  if(foodS!==0){
    for(var i=0;i<foodS;i++){
      if(i%10===0){
        x=80;
        y=y+50;
      }
      imageMode(CENTER);
      image(milkimg,x,y,50,50);
      x=x+30;
    }
  }
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastfed=data.val()
  })
  drawSprites();
  //add styles here
  fill(255,255,254);
  textSize(15);
  if(lastfed>=12){
    text("Last feed:"+lastfed%12+"PM",350,30);
  }else if(lastfed===0){
    text("Last feed:12 AM",350,30);
  }else{
    text("Last feed:"+lastfed+"AM",350,30);
  }
  textSize(30);
  text("Food remaining:"+foodS,100,100);
}

function readStock(data){
  foodS=data.val();
  console.log(foodS);
}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(dogimg2);
  if(foodS<=0){
    foodS=0;
  }else{
    foodS=foodS-1;
  }
  database.ref('/').update({
    'Food':foodS,
    'FeedTime':hour()
  })
}

function getfood(){
  foodS++;
  database.ref('/').update({
    'Food':foodS

  })
}

function updateState(state){
  database.ref('/').update({
    'gameState':state
  })
}