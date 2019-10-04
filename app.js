var express = require("express");
 
var app = express();
 
app.use(express.static('./.tmp/public'));
 
//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));
 
var server = app.listen(8081, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});

const io = require('socket.io')(server);
let interval

io.on('connection', function(socket) {
    console.log("CONNECTED",socket.id)
    socket.on('log', function(data) {
        io.emit('log', data)
    });	
socket.on('start', function(data) {
        interval = setInterval (() => {io.emit('log', data)}, 1000)
    });	
socket.on('stop', function(data) {
        clearInterval(interval)
    });	
socket.on('disconnect', function(socket){console.log("disconnect",socket.id)});
    
});