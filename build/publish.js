var socket = require('socket.io-client')('http://localhost:8081');

module.exports = (appConfig) => {
	
	let publisher = require("./publisher")(appConfig)
	let agent = appConfig.pubAgent

	// publisher.log.then( msg => {
	// 	console.log("STREAM>>>",msg)
	// 	socket.emit('log', {agent, msg})
	// }).catch(e => {
	// 	console.log("STREAM ERROR ", e.toString())
	// })

	publisher.action.then( (zipFile) => {
		// console.log("App publication complete. App ziped into "+zipFile)
		socket.emit('log',{agent, msg:"App publication complete. App ziped into "+zipFile})
		socket.emit('log',{agent, msg:'-end-'})
		// socket.disconnect()
	}).catch(e => {
		console.log("ACTION ERROR ", e.toString())
	})	

}


