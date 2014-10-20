//sphero_skynet-log.js
/*
 * Listen to Skynet 'Lion' channel and console.log Lion's direction
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
    var opposite_direction = 0;
    // When Skynet message received
    my.skynet.on('message', function(data) {
      //console.log('Message', data);
      direction = data.payload.direction;
      console.log('Lion Direction', direction);
      // Find opposite direction
      opposite_direction = ( direction + 180 ) % 360;
      console.log('=> Gnu go to opposite direction: ', opposite_direction);
    });
  }
}).start();

