const getStream = require('get-stream');
const fs = require("fs-extra")
const resolve = require("path").resolve;



// let action = require('execa').shell('npm run jace_publish')
// let stream = action.stdout;
// stream.pipe(process.stdout);

// module.exports = {
// 	log: getStream(stream),
// 	action: action
// }	

var socket = require('socket.io-client')('http://localhost:8081');


module.exports = appConfig => {

	let distDir = `./.${appConfig.id}`
	let agent = appConfig.pubAgent

///////////////////////////////////////////////////////////////////////////////////////////

	socket.emit('log', {agent, msg:"Prepare publishing..."})
	
	fs.mkdirsSync(distDir)
	fs.copySync(
		"./build/template/", 
		distDir, 
		{ overwrite: true }
	)
	fs.copySync(
		"./front-end/public/", 
		`${distDir}/public`, 
		{ overwrite: true }
	)

	fs.copySync(
		"./front-end/src/main.js",
		`${distDir}/src/main.js`,
		{ overwrite: true }	
	)
	
///////////////////////////////////////////////////////////////////////////////////////////

	let html = fs.readFileSync(`${distDir}/public/index.html`).toString()
	let script = `
   		   	  var user = ${JSON.stringify(appConfig.user)};
		      var author = ${JSON.stringify(appConfig.author)};
		      var appName = "${appConfig.name}";
		      var initialConfig = ${JSON.stringify(appConfig)};
		      var dpsURL = "${appConfig.dpsURL}";
		      var __application_Config_Key =  "${appConfig.id}-application-config";
			  var __application_Mode_Key =  "${appConfig.id}-mode";
			  sessionStorage.setItem(__application_Config_Key, JSON.stringify(initialConfig))

   `
   html = html
   		.replace("//__appconfig", script)
   		.replace("//appTitle",appConfig.title)
   	fs.writeFileSync(`${distDir}/public/index.html`, html)

///////////////////////////////////////////////////////////////////////////////////////////

	let jaceConfig = fs.readFileSync(`${distDir}/jace.config.js`).toString()
	jaceConfig = jaceConfig.replace('"__appConfig__"', JSON.stringify(appConfig,null,"\t"))
   	fs.writeFileSync(`${distDir}/jace.config.js`, jaceConfig)

///////////////////////////////////////////////////////////////////////////////////////////
	// console.log(`cd ${resolve(distDir)} && dir && npm run build`)
	
	socket.emit('log', {agent, msg:"Start webpack..."})
	
	let action = require('execa').shell(`cd ${resolve(distDir)} && npm run build`)
	let stream = action.stdout;
	stream.pipe(process.stdout);

	// getStream(stream).then( msg => {
	// 	console.log("STREAM>>>",msg)
	// 	socket.emit('log', {agent, msg})
	// })


	return {
		// log: getStream(stream).then( msg => {
		// 	console.log("STREAM>>>",msg)
		// 	socket.emit('log', {agent, msg})
		// }),

		action: 
			action
				// .then( res => {
				// 	return fs.copy(
				// 		`${distDir}/.dist/`,
				// 		'./.tmp/public/', 
				// 		{ overwrite: true }
				// 	)
				// })
				.then( res => {
					socket.emit('log', {agent, msg:"Compress publishing..."})
					let zipName = `${appConfig.id}-${ require("moment") (new Date()).format("YYYY_MM_DD_HH_MM_ss")}.zip`
					return require ("../fs/zip") (`${distDir}/.dist/`, `./.tmp/public/${zipName}`).then(() => zipName)					
				})
				.then(zipName => {
					socket.emit('log', {agent, msg:zipName})
					socket.emit('log', {agent, msg:"Remove temp files."})
					fs.removeSync(distDir)
					return zipName
				})
	}	

///////////////////////////////////////////////////////////////////////////////////////////   	

}

