const express = require("express");
 
 
if( !process.env.NODE_ENV ){
    process.env.NODE_ENV = "development"
}
const mode = process.env.NODE_ENV

const config = require(`./config/mode/${mode}`)

let app = express();
 
app.use(express.static('./.tmp/public'));
 
let server = app.listen(config.port, function(){
    console.log(`Mode: ${mode}. JACE Pub Service started at port: ${server.address().port}.`);
});

const io = require('socket.io')(server);
const publish = require("./build/publish")

io.on('connection', function(socket) {
    console.log("CONNECTED",socket.id)
    
    socket.on('log', function(data) {
        io.to(data.agent).emit('log', data.msg)
    });

    socket.on('publish', function(data) {
            io.to(data.pubAgent).emit('log', `Accept publication request for ${data.name}`)
            publish(data)             
    });	

    
    // socket.on('disconnect', function(socket){console.log("disconnect",socket.id)});
    
});