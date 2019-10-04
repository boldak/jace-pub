const RuleSet = require('webpack/lib/RuleSet')
const jaceCompile = require("./jace-compiler")

class JaceLoaderPlugin {
  constructor (options) {
    this.options = options
  }

  apply (compiler) {

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin(
        'html-webpack-plugin-before-html-processing',
          data => {
            // console.log("html")
            data.html = jaceCompile(data.html, this.options)
            return data  
          }
        )
    })


	
    // use webpack's RuleSet utility to normalize user rules
    const rawRules = compiler.options.module.rules
    const { rules } = new RuleSet(rawRules)

    

    rules.forEach( rule => {
      if(rule.use && rule.use.find(u => u.loader === 'babel-loader')){
          rule.use.unshift({
            loader: require.resolve('./parser'),
            options: this.options
          })
          // console.log("BABEL RULE",rule.use)        
      }
    })

    rules.forEach( rule => {
      if(rule.use && rule.use.find(u => u.loader === 'eslint-loader')){
          rule.use.unshift({
            loader: require.resolve('./parser'),
            options: this.options
          })
          // console.log("ESLINT RULE",rule.use)        
      }
    })
  

    // find the rule that applies to vue files
    let vueRuleIndex = rules.findIndex(rule => rule.use && rule.use.find(u => u.loader === 'vue-loader'))
    const vueRule = rules[vueRuleIndex]

    if (!vueRule) {
      throw new Error(
        `[JaceLoaderPlugin Error] No matching rule for vue-loader found.\n` +
        `Make sure there is at least one root-level rule that uses vue-loader.`
      )
    }

    vueRule.use.unshift({
      loader: require.resolve('./parser'),
      options: this.options
    })
  // console.log("VUE RULE", vueRule.use)
    
    compiler.options.module.rules = rules
  }
}

module.exports = JaceLoaderPlugin