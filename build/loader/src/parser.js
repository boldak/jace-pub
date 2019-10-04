const path = require('path')
const loaderUtils = require('loader-utils')
const compile = require("./jace-compiler")


module.exports = async function (content, sourceMap) {
  
  this.async()
  this.cacheable()

  const options = {
    ...loaderUtils.getOptions(this)
  }
 
  content = compile(content, options)

  this.callback(null, content, sourceMap)

}
