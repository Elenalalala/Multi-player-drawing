let socket;


let x=0;
let y=100;
let z=200;
let colorValue =355;
let pointerSize;
let layer;
let userInfo;

function setup() {
  createCanvas(windowWidth,windowHeight);
  colorValue = random(255,355);
  pointerSize = random(20,50);

  layer = createGraphics(windowWidth,windowHeight);
//reference resource: https://socket.io/docs/v3/handling-cors/#Configuration
  socket = io.connect('https://multi-drawing-tool.herokuapp.com', {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "drawingtoolheader"
    }
  });
  socket.on('mouse',newDrawing);
  socket.on('user', newUserPointer);
}

function draw() {
  background(255);
  noFill();
  stroke(noise(x)*colorValue,noise(y)*colorValue,noise(z)*colorValue);
  ellipse(mouseX,mouseY,pointerSize,pointerSize);
  text(socket.id,mouseX+20,mouseY);


  //user cursor
  if(userInfo != undefined){
  ellipse(userInfo.x,userInfo.y,userInfo.size,userInfo.size);
  text(userInfo.id,userInfo.x,userInfo.y);
  }

  image(layer,0,0);
  if(mouseIsPressed){
    x+=0.05;
    y+=0.05;
    z+=0.05;
    layer.noStroke(); 
    layer.fill(noise(x)*colorValue,noise(y)*colorValue,noise(z)*colorValue);
    layer.ellipse(mouseX,mouseY, pointerSize,pointerSize);
    
    // console.log('Sending:'+mouseX+','+mouseY);
    let data = {
      x:mouseX,
      y:mouseY,
      r:noise(x)*colorValue,
      g:noise(y)*colorValue,
      b:noise(z)*colorValue,
      size:pointerSize
    };
    socket.emit('mouse', data);
  }
  let userId = {
    id:socket.id,
    x:mouseX,
    y:mouseY,
    size:pointerSize
  }
  socket.emit('user', userId);
}

function newDrawing(data){
  image(layer,0,0);
  layer.noStroke(); 
  layer.fill(data.r,data.g,data.b);
  layer.ellipse(data.x,data.y, data.size,data.size);
}
function newUserPointer(info){
  userInfo = info;
  background(255);
  noFill();
  stroke(0);
  
}

