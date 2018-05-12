const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const NameAllModulesPlugin = require('name-all-modules-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const isDev = process.env.NODE_ENV === 'development';
const cdnConfig = require('../app.config').cdn

const config  = webpackMerge(baseConfig,{
	entry:{
		app: path.join(__dirname,'../client/app.js')
	},
	output:{
		filename: '[name].[hash:5].js',
	},
	plugins: [
	  new HTMLPlugin({
		template: path.join(__dirname, '../client/template.html'),
		// filename: 'app.html'
	  }),
	  new HTMLPlugin({
	    template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
	    filename: 'server.ejs'
	  })
	]
})

if (isDev) {
	config.devtool = '#cheap-module-eval-source-map'
	config.entry = {
	  app: [
		'react-hot-loader/patch',
		path.join(__dirname, '../client/app.js')
	  ]
	}
	config.devServer ={
		host: '0.0.0.0',
		port: '8888',
		hot: true,
		overlay: {
		  errors: true
		},
		publicPath: '/public/',
		historyApiFallback: {
		  index: '/public/index.html'
		},
		proxy: {
		  '/api': 'http://localhost:3333'
		}
	}
	config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.entry = {
    app: path.join(__dirname, '../client/app.js'),
    vendor: [
      'react',
      'react-dom',
      'react-router-dom',
      'mobx',
      'mobx-react',
      'axios',
      'query-string',
      'dateformat',
      'marked',
      'classnames'
    ]
  }
  config.output.filename = '[name].[chunkhash].js'
  // config.output.publicPath = cdnConfig.host
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    new webpack.NamedModulesPlugin(),
    new NameAllModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name
      }
      return chunk.mapModules(m => path.relative(m.context, m.request)).join('_')
    })
  )
}

module.exports = config
