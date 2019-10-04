const getStream = require('get-stream');

let action = require('execa').shell('npm run jace_publish')
let stream = action.stdout;
stream.pipe(process.stdout);

module.exports = {
	log: getStream(stream),
	action: action
}	


