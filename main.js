let car = app.car;
// app.$set(app, 'car', car);
let input = app.input;

let lastTimeMs = performance.now();
let currentTimeMs;
let deltaTime;
let leftWheelTravelled = 0;
let rightWheelTravelled = 0;
function calc() {
  let x = car.x;
  let y = car.y;
  let theta = car.theta;
  let v1 = car.v1;
  let v2 = car.v2;
  let r = car.r;
  if (v1 == v2) {
    car.x = x + v1 * deltaTime * Math.cos(theta);
    car.y = y + v1 * deltaTime * Math.sin(theta);
  } else {
    let w = (v2 - v1) / (2 * r);
    let R = r * (v1 + v2) / (v1 - v2);
    let newTheta = theta + w * deltaTime;
    car.x = x + R * (Math.sin(theta) - Math.sin(newTheta));
    car.y = y - R * (Math.cos(theta) - Math.cos(newTheta));
    car.theta = newTheta;
  }
  leftWheelTravelled += v1 * deltaTime;
  rightWheelTravelled += v2 * deltaTime;
}
function setV() {
  car.v1 = getNextTickV(car.v1, input.v1);
  car.v2 = getNextTickV(car.v2, input.v2);
}
function getNextTickV(currentV, targetV) {
  if (currentV == targetV) return currentV;
  let acc;
  if (Math.abs(targetV) > Math.abs(currentV) && Math.sign(targetV) == Math.sign(currentV))
    acc = app.environment.maxAcceleration;
  else
    acc = app.environment.maxDeceleration;
  if (Math.abs(targetV - currentV) < acc * deltaTime)
    return targetV;
  return currentV + acc * deltaTime * Math.sign(targetV - currentV);
}
let started = true;
function next() {
  currentTimeMs = performance.now();
  deltaTime = (currentTimeMs - lastTimeMs) / 1000;
  readGamepad();
  setV();
  calc();
  lastTimeMs = currentTimeMs;
  requestAnimationFrame(next);
}
requestAnimationFrame(next);

// ============
// controller + ui

let index;
window.addEventListener("gamepadconnected", (event) => {
  app.controllerConnected = true;
  app.controllerName = event.gamepad.id;
  index = event.gamepad.index;
});

function getGamepadInputs() {
  return navigator.getGamepads()[index];
}
function getCorrectedAxes() {
  return getGamepadInputs().axes.slice().map(x => {
    let absx = Math.abs(x);
    return absx < app.deadzone ? 0 : (absx - app.deadzone) / (1 - app.deadzone) * Math.sign(x);
  });
}

function readGamepad() {
  if (!app.controllerConnected) return;
  app.controlMethods[app.selectedControlMethod].readGamepad();
}

