const zip = require("./zip")

zip("./a", "a.zip")
	.then(()=>{
		console.log("Zipped a.zip")
	})