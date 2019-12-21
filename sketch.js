// draw svg
// https://thedevband.com/online-svg-viewer.html
let sketch = {
  cx: 0,
  cy: 0,
  scaleValue: 1,
  camAngleRad: 0
}
let dotColor = 'lightgray';
// let dotColor = 'black';
function findCenter() {
  sketch.cx = width/2 / sketch.scaleValue;
  sketch.cy = height/2 / sketch.scaleValue;
}
function findCar() {
  findCenter();
  sketch.cx -= car.x;
  sketch.cy += car.y;
}
function drawCar() {
  let x = car.x;
  let y = car.y;
  let theta = car.theta;
  push();
  translate(sketch.cx + x, sketch.cy - y);
  rotate(PI / 2 - theta);
  imageMode(CENTER);
  image(img, 0, 0, 200, 200);
  drawCarWheels();
  pop();
}
const wheelLines = 20;
const wheelDiameter = 64.9;
function drawCarWheels() {
  strokeWeight(2);
  stroke('black');
  drawWheelLines(calcLines(leftWheelTravelled), -80.8, -54.8);
  drawWheelLines(calcLines(rightWheelTravelled), 80.8, 54.8);
  // rect(-100, -100, 5, 5);
}
function drawWheelLines(lines, startx, endx) {
  lines.forEach(y => {
    line(startx, y, endx, y);
  });
}
function calcLines(travelled) {
  let offsetRad = travelled / (wheelDiameter / 2);
  let lines = [];
  for (let i = 0; i < wheelLines; i++) {
    let rad = normAngle(offsetRad + 2 * PI * i / wheelLines);
    if (rad >= 0) lines.push(wheelDiameter / 2 * Math.cos(rad));
  }
  return lines;
}
// ===========
// draw background
function drawCenter() {
  noFill();
  strokeWeight(2 / sketch.scaleValue);
  stroke('black');
  circle(sketch.cx, sketch.cy, 10 / sketch.scaleValue);
}
const gridDistance = 100;
function posMod(a, b) {
  return a - Math.floor(a / b) * b;
}
function drawBackground() {
  noStroke();
  fill(dotColor);
  let xDots = Math.floor(width / sketch.scaleValue / gridDistance) + 1;
  let yDots = Math.floor(height / sketch.scaleValue / gridDistance) + 1;
  let dots = Math.floor(Math.hypot(width, height) / sketch.scaleValue / gridDistance) + 1;
  let firstX = posMod(sketch.cx, gridDistance);
  let firstY = posMod(sketch.cy, gridDistance);
  let ci = Math.floor(sketch.cx / gridDistance);
  let cj = Math.floor(sketch.cy / gridDistance);
  let si = ((xDots - dots) / 2) << 0;
  let sj = ((yDots - dots) / 2) << 0;
  for (let i = si; i < si + dots; i++) {
    for (let j = sj; j < sj + dots; j++) {
      if (i != ci || j != cj) {
        circle(firstX + i * gridDistance, firstY + j * gridDistance, 5 / sketch.scaleValue);
      }
    }
  }
}

// ===========
// mouse events
let leftPressed = false;
let lastMouseX, lastMouseY;
function isInputDOM(dom){
  return 'tabIndex' in dom && !isNaN(dom.tabIndex) && dom.tabIndex > -1;
}
function mousePressed(event) { // event.button 0 1 2 left middle right
  if (isInputDOM(event.target)) return;
  if (event.button == 0) leftPressed = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}
function mouseReleased(event) {
  if (event.button == 0) leftPressed = false;
}
function mouseDragged() {
  if (leftPressed) {
    let dx = (mouseX - lastMouseX) / sketch.scaleValue;
    let dy = (mouseY - lastMouseY) / sketch.scaleValue;
    let [dx2, dy2] = rotateCoord(dx, dy, sketch.camAngleRad);
    sketch.cx += dx2;
    sketch.cy += dy2;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}
let defaultZoomMultiplier = 0.9;
function zoom(zoomMultiplier) {
  let newScale = sketch.scaleValue * zoomMultiplier;
  if (newScale > 10 || newScale < 1/10) return;
  let dx = mouseX - width / 2;
  let dy = mouseY - height / 2;
  let [dx2, dy2] = rotateCoord(dx, dy, sketch.camAngleRad);
  sketch.cx += (1 / zoomMultiplier - 1) * (width / 2 + dx2) / sketch.scaleValue;
  sketch.cy += (1 / zoomMultiplier - 1) * (height / 2 + dy2) / sketch.scaleValue;
  sketch.scaleValue = newScale;
}
function zoomIn(originX, originY) {
  zoom(1 / defaultZoomMultiplier);
}
function zoomOut(originX, originY) {
  zoom(defaultZoomMultiplier);
}
function mouseWheel() {
  if (event.delta < 0) {
    zoomIn();
  } else if (event.delta > 0) {
    zoomOut();IDBKeyRange
  }
}

// ===========
// entry point

let img;
let svg;
function preload() {
  img = loadImage('car.svg');
  svg = new Image();
  svg.src = 'car.svg';
  //img.elt = svg;
  img.canvas = svg; // svg hack
}
let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  sketch.cx = windowWidth / sketch.scaleValue / 2;
  sketch.cy = windowHeight / sketch.scaleValue / 2;
  canvas.style('display', 'block');
  canvas.parent('sketch-holder');
  frameRate(60);
}

function windowResized() {
  sketch.cx = sketch.cx - width / sketch.scaleValue / 2 + windowWidth / sketch.scaleValue / 2;
  sketch.cy = sketch.cy - height / sketch.scaleValue / 2 + windowHeight / sketch.scaleValue / 2;
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  clear();
  if (app.lockViewToCar) findCar();
  if (app.lockAngleToCar)
    sketch.camAngleRad = car.theta - PI / 2;
  else
    sketch.camAngleRad = 0;
  if (app.lockViewToCar || app.lockAngleToCar)
    dotColor = 'black';
  else
    dotColor = 'lightgrey';
  translate(width / 2, height / 2);
  rotate(sketch.camAngleRad);
  translate(-width / 2, -height / 2);
  scale(sketch.scaleValue);
  drawBackground();
  drawCenter();
  drawCar();
}