const getStream = require('get-stream');
const fs = require("fs-extra")
const resolve = require("path").resolve;

module.exports = appConfig => {

	var socket = require('socket.io-client')('http://localhost:8081');

	socket.on("info", (socketID) => {
			socket.emit("init",`${socketID} JACE publisher`)
	})

	let distDir = `./.${appConfig.id}`
	let agent = appConfig.pubAgent

///////////////////////////////////////////////////////////////////////////////////////////

	socket.emit('process', {agent, msg:"Prepare publishing..."})
	
	fs.mkdirsSync(distDir)

	fs.copySync(
		"./node_modules/jace-front/",
		`${distDir}/`,
		{ overwrite: true }	
	)

	fs.copySync(
		"./build/template/", 
		distDir, 
		{ overwrite: true }
	)

	

///////////////////////////////////////////////////////////////////////////////////////////

	let html = fs.readFileSync(`${distDir}/public/index.html`).toString()
	let script = `
   		   	  var devService = ${JSON.stringify(appConfig.devService)}
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
	
	socket.emit('process', {agent, msg:"Start webpack..."})
	
	let action = require('execa').shell(`cd ${resolve(distDir)} && npm run build`)
	let stream = action.stdout;
	stream.pipe(process.stdout);

	return {

		action: 
			action
				.then( res => {
					socket.emit('process', {agent, msg:"Compressing..."})
					let zipName = `${appConfig.id}-${ require("moment") (new Date()).format("YYYY_MM_DD_HH_MM_ss")}.zip`
					return require ("../fs/zip") (`${distDir}/.dist/`, `./.tmp/public/${zipName}`).then(() => zipName)					
				})
				.then(zipName => {
					socket.emit('process', {agent, msg:zipName})
					socket.emit('process', {agent, msg:"Remove temp files."})
					fs.copySync(`${distDir}/.dist/`,`./.tmp/public/`)
					fs.removeSync(distDir)
					return zipName
				})
	}	

///////////////////////////////////////////////////////////////////////////////////////////   	

}

