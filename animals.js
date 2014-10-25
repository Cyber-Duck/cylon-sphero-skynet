/*
 * Lion Robot
 * 
 * 
 * 
 * */


var Cylon = require('cylon');

// Update Bluetooth ports with real values, add or remove robots 
var lions = [
  { port: '/dev/cu.Sphero-BYO-AMP-SPP', name: 'Lion1' }
];

var gnus = [
    { port: '/dev/cu.Sphero-YRB-AMP-SPP', name: 'Gnu1' },
    { port: '/dev/cu.Sphero-RBR-AMP-SPP', name: 'Gnu2' },
    { port: '/dev/cu.Sphero-BOW-AMP-SPP', name: 'Gnu3' }
];

// Lion colors
var lion_color = 'red';
var lion_color_impact = 0xFFFF00;
var lion_color_dead = 0x000000;

// Gnu colors
var gnu_color = 'darkblue';
var gnu_color_impact = 0xFFFF00;
var gnu_color_dead = 0x000000;

// Lion speed: between 1 and 100
var lion_speed = 100;

// Gnu speed: between 1 and 100
var gnu_speed = 100;

var LionRobot = (function() {
  function LionRobot() {}

  LionRobot.prototype.connection = [
  	{ port: '', name: '', adaptor: 'sphero' },
  	{ name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" }
  ];
  
  LionRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  LionRobot.prototype.born = function() {

    var _this = this;

    // On creation, set the default direction and color
    _this.lion_direction = 0;
    _this.sphero.setColor(lion_color);
    _this.sphero.setBackLED(100);

  };

  LionRobot.prototype.move = function() {

    var _this = this;

    _this.sphero.roll(lion_speed, _this.lion_direction);
    console.log(_this.lion_direction);
  };

  // Main Robot logic
  LionRobot.prototype.work = function(me) {

    var _this = this;

    this.born();

    console.log('Calibration Start lion');
    me.sphero.startCalibration();

    after((5).seconds(), function() {
        console.log('Calibration finish lion');
        me.sphero.finishCalibration()
    });

    me.sphero.on('collision', function() {
      // On collision, change color
      //_this.sphero.setRGB(lion_color_impact);
      //7_this.sphero.setRGB(lion_color);
    });
	
	every((5).second(), function() {
      // Generate a randon direction 0-360
      _this.lion_direction = Math.floor(Math.random() * 360);
      console.log('Lion direction: '+_this.lion_direction);
      // Post direction to Skynet chatroom
      me.skynet.message({
		  "devices": "eee99e91-58aa-11e4-a406-e361fc970baa",
		  "payload": {"direction": _this.lion_direction}
	  });
	  // Move
      me.move();
    });
  };

  return LionRobot;

})();

var GnuRobot = (function() {
  function GnuRobot() {}

  GnuRobot.prototype.connection = [
    { port: '', name: '', adaptor: 'sphero' },
    { name: 'skynet', adaptor: 'skynet', uuid: "eee99e91-58aa-11e4-a406-e361fc970baa", token: "3vlrauvp274d9529ppan51ag3hr27qfr" }
  ];
  
  GnuRobot.prototype.device = { name: 'sphero', driver: 'sphero' };

  GnuRobot.prototype.born = function() {

    var _this = this;

    // On creation, set direction and color
    _this.gnu_direction = 0;
    _this.sphero.setColor(gnu_color);
    _this.sphero.setBackLED(100);
  };

  GnuRobot.prototype.move = function() {

    var _this = this;

    _this.sphero.roll(gnu_speed, _this.gnu_direction);
  };
/*
  GnuRobot.prototype.death = function() {
    this.sphero.setRGB(Gnu_color_dead);
    this.sphero.stop();
  };
*/

  // Main Robot logic
  GnuRobot.prototype.work = function(me) {

    var _this = this;

    me.born();

    console.log('Calibration Start');
    me.sphero.startCalibration();

    after((5).seconds(), function() {
        console.log('Calibration Finish');
        me.sphero.finishCalibration()
    });

    me.sphero.on('collision', function() {
      // On collision, change color
      //this.sphero.setRGB(gnu_color_impact);
      //this.sphero.setRGB(gnu_color);
    });

  // When received a message from the lion
  me.skynet.on('message', function(data) {
      // Get lion's direction
      direction = data.payload.direction;
      console.log('Lion Direction', direction);
      // Find opposite direction
      _this.gnu_direction = ( direction + 180 ) % 360;
      console.log('=> Gnu go to opposite direction: ', _this.gnu_direction);
      // Move
      me.move();
    });
  };

  return GnuRobot;

})();

// Create the lions
for (var i = 0; i < lions.length; i++) {
  var bot = lions[i];
  var robot = new LionRobot;

  robot.connection[0].port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

// Create the gnus
for (var i = 0; i < gnus.length; i++) {
  var bot = gnus[i];
  var robot = new GnuRobot;

  robot.connection[0].port = bot.port;
  robot.name = bot.name;

  Cylon.robot(robot);
}

// Run Cylon
Cylon.start();