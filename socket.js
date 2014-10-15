var http = require('http');
var fs = require('fs');
var app = require(__dirname + '/express.js');

app.set('port', process.env.PORT || 8008);

module.exports = function (butler, done) {

    var that = this;
    this.log = butler.getAssistantLogger("Sockets");

    var server = app.listen(app.get('port'), (function() {
        this.log('Express server listening on port ' + server.address().port);
    }).bind(this));

    var io = require('socket.io')(server);

    io.on('connection', (function (socket) {
        this.log('Client connected from ' + socket.handshake.address);
        butler.getPlayingStatus(io.emit.bind(io, 'butler:connected'));
        io.emit('butler:playlist', butler.playlist);
        socket.on('butler:toggle', butler.toggle.bind(butler));
        socket.on('butler:queue', butler.queue.bind(butler));
        socket.on('butler:nextone', butler.nextone.bind(butler));
        socket.on('butler:prevone', butler.prevone.bind(butler));
        socket.on('butler:volumeup', butler.volumeUp.bind(butler));
        socket.on('butler:volumedown', butler.volumeDown.bind(butler));
        socket.on('butler:playnumber', butler.playNumber.bind(butler));
        socket.on('butler:seek', butler.seek.bind(butler));
        socket.on('disconnect', function () {
            that.log('Client disconnected from ' + socket.handshake.address);
            this.removeAllListeners();
        });
        socket.on('error', function (err) {
            butler.error(err);
        });
    }).bind(this));
    io.on('error', function (err) {
        bulter.error(err);
    });

    var notify = io.emit.bind(io);

    butler.notifiers.push(notify);

    return done();
}
