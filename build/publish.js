var socket = require('socket.io-client')('http://localhost:8081');

module.exports = (appConfig) => {
	
	let publisher = require("./publisher")(appConfig)
	let agent = appConfig.pubAgent

	socket.on("info", (socketID) => {
		socket.emit("init",`${socketID} publish process wrapper`)
	})

	publisher.action.then( (zipFile) => {

		socket.emit('process',{agent, msg:"App publication complete. App ziped into "+zipFile})
		socket.emit('process',{agent, msg:'-end-'})

	}).catch(e => {
		console.log("ACTION ERROR ", e.toString())
	})	

}


