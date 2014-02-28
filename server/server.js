/**
 * Created by Bach on 25.02.14.
 */
var connect = require('connect');
var server = connect()
    .use(connect.static(__dirname + '/../client'))
    .listen('8080');


var socket = require('socket.io');
var io = socket.listen(server);
io.sockets.on('connection', function(socket){
    console.log('- client connected to socket');

    // sockets -----------------------------------------------------------------------
    socket.on("sockettest_send", function(data){
        socket.emit("sockettest_receive", data);
    });

    // chat --------------------------------------------------------------------------
    setTimeout(function(){
        socket.emit("hello", "guest");
    }, 1);

    socket.on("ready", function(){
        socket.broadcast.emit("ready");
    });

    socket.on("eSendMessage", function(message){
        console.log("incoming message: " + message);
        socket.broadcast.emit("eBroadcastMessage", message);
    });
});

