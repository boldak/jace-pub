let fs = require("fs-extra")

fs.copySync(
	"./node_modules/jace-front/", 
	"./front-end/", 
	{ overwrite: true }
)

fs.mkdirsSync("./.tmp/public/")