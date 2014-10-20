//sphero_color.js
/*
 * Assign random color to Sphero every second
 * */

var Cylon = require('cylon');

Cylon.robot({
  connection: { name: 'sphero', adaptor: 'sphero', port: '/dev/rfcomm0' },
  device: { name: 'sphero', driver: 'sphero' },

  work: function(me) {
    every((1).second(), function() {
      me.sphero.setRGB(Math.floor(Math.random() * 100000));
    });
  }
});

Cylon.start();