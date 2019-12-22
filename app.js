let app = new Vue({
  el: '#app',
  data: {
    normAngle: normAngle,
    message: 'Hello Vue!',
    controllerConnected: false,
    controllerName: "",
    deadzone_: 0.2,
    car: {
      x: 0,
      y: 0,
      theta: Math.PI / 2,
      v1: 0,
      v2: 0,
      r: 67.8
    },
    environment: {
      maxAcceleration: 512,
      maxDeceleration: 1024,
      maxVelocity: 255
    },
    input: {
      v1: 0,
      v2: 0
    },
    sketch: {},
    lockViewToCar: false,
    lockAngleToCar: false,
    controlMethods: [],
    selectedControlMethod: 0
  },
  computed: {
    deadzone: {
      get: function() {
        return this.deadzone_;
      },
      set: function(val) {
        if (!isNaN(parseFloat(val)))
          this.deadzone_ = val;
      }
    }
  }
})

let saves = ['deadzone_', 'environment', 'selectedControlMethod', 'lockViewToCar', 'lockAngleToCar'];
let savesObj = localStorage.saves ? JSON.parse(localStorage.saves) : {};
saves.forEach(x => {
  if (x in savesObj) {
    app[x] = savesObj[x];
  }
  app.$watch(x, function() {
    savesObj[x] = app[x];
    localStorage.saves = JSON.stringify(savesObj);
  }, {
    deep: true
  })
})


