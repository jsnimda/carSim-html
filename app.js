let app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    controllerConnected: false,
    controllerName: "",
    deadzone_: 0.2,
    car: {},
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
