const path = require("path")
const VuetifyLoaderPlugin = require('./build/vuetify-loader/lib/plugin')
const JaceLoaderPlugin = require("./build/jace-loader/src/plugin")
const jaceConfig = require("./jace.config.js")

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}


module.exports = {

    outputDir: './.dist',

    chainWebpack: config => {
   
	// config.resolve.alias
 //        .set('@', resolve('./front-end/src'))
     
       

        config.module
            .rule('js')
            .test(/\.m?jsx?$/)
            .include
            .add(resolve('vuetify'))
            .end()

        

        config.plugin('VuetifyLoaderPlugin')
            .use(VuetifyLoaderPlugin)
            
        config.plugin('JaceLoaderPlugin')
            .use(new JaceLoaderPlugin(jaceConfig))      
        


        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => ({
                ...options,
                transformAssetUrls: {
                    // v-app-bar extends v-toolbar
                    'v-app-bar': 'src',
                    // v-carousel-item extends v-img
                    'v-carousel-item': ['src', 'lazy-src'],
                    'v-img': ['src', 'lazy-src'],
                    'v-navigation-drawer': 'src',
                    'v-parallax': 'src',
                    'v-toolbar': 'src',
                },
            }))

     	  
    }

}