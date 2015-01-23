/**
 * Run an http server which will respond to requests by creating robots
 * Example usage:
 * curl "localhost:9090?name=calibano&port=/dev/tty.Sphero-RBR-AMP-SPP"
 */

var Cylon = require('cylon');
var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  console.log('Request received');

  var parts = url.parse(req.url, true);
  var query = parts.query;
  var robot = new Sphero();
  robot.born(query.name, query.port);
  Cylon.robot(robot).start();

  res.end('Robot added\n');

}).listen(9090, '127.0.0.1');

var Sphero = (function() {
  function Sphero() {}

  Sphero.prototype.connection = [];

  Sphero.prototype.device = { name: 'sphero', driver: 'sphero' };

  Sphero.prototype.born = function(_name, _port) {
    this.connection.push({ adaptor: 'sphero', name: _name, port: _port });
  };

  Sphero.prototype.color = function() {
    _this.sphero.setRGB(Math.floor(Math.random() * 100000));
  };

  Sphero.prototype.work = function(me) {
    every((1).second(), function() {
      me.sphero.roll(60, Math.floor(Math.random() * 360));
      me.sphero.setRGB(Math.floor(Math.random() * 100000));
    });
  };

  return Sphero;

})();
