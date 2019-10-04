let publisher = require('./publisher')

publisher.log.then( res => {
	console.log(res)
})

publisher.action.then(() => {
	console.log("JACE publish action complete")
	const resolve = require("path").resolve
	const zip = require("./fs/zip")
	zip("./dist/.dist/", "./dist/export.zip").then(()=>{
		console.log("app zipped in ", resolve("./dist/export.zip"))	
	})
	
})


