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
const to = resolve("./b/1/")
console.log(from, to)
      if (fs.existsSync(from)) {
        fs.copySync(from, to, { overwrite: true })
      }
// }  
  
//     })
//   }
// }
