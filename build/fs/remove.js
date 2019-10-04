const fs = require('fs-extra')
const resolve = require("path").resolve
// module.exports = class MovePlugin {
//   constructor (from, to) {
//     this.from = from
//     this.to = to
//   }

//   apply (compiler) {
//     compiler.hooks.done.tap('move-plugin', () => {
// module.exports = (from, to) => {
const from = resolve("./a/")
console.log(from)
      if (fs.existsSync(from)) {
        fs.removeSync(from)
      }
// }  
  
//     })
//   }
// }
