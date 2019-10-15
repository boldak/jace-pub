const express = require("express");
const fs = require("fs-extra")

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development"
}
const mode = process.env.NODE_ENV
console.log(`Start JACE PUB SERVICE in  ${mode} mode.`)

let app = express();
app.use(express.static('./.tmp/public'));
app.get('*', function() {});


let server = app.listen({ port: process.env.PORT || 8081 }, function() {
    console.log(`🚀 JACE PUB SERVICE ready at ${JSON.stringify(server.address())}`);
});


const publish = require("./build/publish")
const io = require('socket.io')(server);
io.set('origins', '*:*');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

io.on('connection', function(socket) {
    console.log("Connect >>>>>>>>>>>>> ", socket.id)

    io.to(socket.id).emit("info", socket.id)

    socket.on('init', function(data) {
        console.log("INIT >>>>>>>>>>>>>>>>>>>>", data)
    });

    socket.on('process', function(data) {
        console.log(`PROCESS >> ${data.agent} >> ${data.msg}`)
        io.to(data.agent).emit('log', data.msg)

    });

    socket.on("complete", function(data){
        console.log(`>> ${data.pubAgent} >> Complete`)
        fs.removeSync(`./.tmp/public/${data.file}`)
        io.to(data.pubAgent).emit('log', `Remove ${data.file} on server side.`);
        io.to(data.pubAgent).emit('log', `That all folks!`);
              
    })

    socket.on('publish', function(data) {
        console.log(`>> ${data.pubAgent} >> Accept publication request for ${data.name}`)
        io.to(data.pubAgent).emit('log', `Accept publication request for ${data.name}`)
        publish(data)
    });

    socket.on('download', function(data) {
        io.to(data.pubAgent).emit("log", `Download ${data.file} ...`)
        console.log(`>> ${data.pubAgent} >> Download ${data.file} ...`)
        fs.readFile(`./.tmp/public/${data.file}`, function(err, buf) {
            io.to(data.pubAgent).emit('download-result', { filename: data.file, buffer: buf });
        });
    })

});