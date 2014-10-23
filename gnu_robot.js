/*
 * Gnu Robot
 * 
 * 
 * 
 * */


var Cylon = require('cylon');

// Define the Gnu herd
// Update Bluetooth ports with real values, add or remove robots 
var bots = [
  { port: '/dev/rfcomm0', name: 'Gnu1' },
  { port: '/dev/rfcomm1', name: 'Gnu2' },
  { port: '/dev/rfcomm2', name: 'Gnu3' },
  { port: '/dev/rfcomm3', name: 'Gnu4' }
];

// Gnu colors
var gnu_color = 0xFFCC33;
var gnu_color_impact = 0xFFFF00;
var gnu_color_dead = 0x000000;

// Gnu speed: between 1 and 100
var gnu_speed = 60;

var GnuRobot = (function() {
  function GnuRobot() {}

  GnuRobot.prototype.connection = [
  	{ name: 'Sphero', adaptor: 'sphero' },
  	{ name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" };
  ];
  
  GnuRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  GnuRobot.prototype.born = function() {
    // On creation, set direction and color
    this.gnu_direction = 0;
    this.sphero.setRGB(gnu_color);
  };

  GnuRobot.prototype.move = function() {
    this.sphero.roll(gnu_speed, this.gnu_direction);
  };
/*
  GnuRobot.prototype.death = function() {
    this.sphero.setRGB(Gnu_color_dead);
    this.sphero.stop();
  };
*/

  // Main Robot logic
  GnuRobot.prototype.work = function(me) {
    me.born();

    me.sphero.on('collision', function() {
      // On collision, change color
      this.sphero.setRGB(gnu_color_impact);
      this.sphero.setRGB(gnu_color);
    });

	// When received a message from the lion
	me.skynet.on('message', function(data) {
      // Get lion's direction
      direction = data.payload.direction;
      console.log('Lion Direction', direction);
      // Find opposite direction
      this.gnu_direction = ( direction + 180 ) % 360;
      console.log('=> Gnu go to opposite direction: ', this.gnu_direction);
      // Move
      me.move();
    });
  };

  return GnuRobot;

})();

// Create the robots
for (var i = 0; i < bots.length; i++) {
  var bot = bots[i];
  var robot = new GnuRobot;

  robot.connection.port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

// Run Cylon
Cylon.start();