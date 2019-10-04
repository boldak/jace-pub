const resolve = require('path').resolve;
const fs = require('fs');
const JsZip = require('jszip');
const path = require('path');

let buildZipFromDirectory = (dir, zip, root) => {
    const list = fs.readdirSync(dir);

    for (let file of list) {
        file = path.resolve(dir, file)
        let stat = fs.statSync(file)
        if (stat && stat.isDirectory()) {
            buildZipFromDirectory(file, zip, root)
        } else {
            const filedata = fs.readFileSync(file);
            zip.file(path.relative(root, file), filedata);
        }
    }
}


module.exports = async (dir, file) => {
	const sourceDir = resolve(dir)
	let zip = new JsZip();
    buildZipFromDirectory(sourceDir, zip, sourceDir);

    /** generate zip file content */
    const zipContent = await zip.generateAsync({
        type: 'nodebuffer',
        comment: 'ser-web-manangement',
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    });

    /** create zip file */
    fs.writeFileSync(resolve('./', file), zipContent);
}
