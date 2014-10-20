//sphero_skynet-log.js
/*
 * Every 5 seconds Lion posts direction to Skynet 'Lion' channel
 * Channel created using: 
 *   curl -X POST -d "name=lion&direction=90" http://skynet.im/devices
 * */

var Cylon = require('cylon');

Cylon.robot({
  connections: [
    { name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" }
  ],

  work: function(my) {
    var direction = 0;
    // Every 5 seconds
    every((5).second(), function() {
      // Generate a randon direction 0-360
      direction = Math.floor(Math.random() * 360);
      console.log('direction: '+direction);
      // Post direction to Skynet chatroom
      my.skynet.message({
		  "devices": "eee99e91-58aa-11e4-a406-e361fc970baa",
		  "payload": {"direction": direction}
	  });
    });
  }
}).start();

