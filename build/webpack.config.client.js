const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const isDev = process.env.NODE_ENV === 'development';

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
}

module.exports = config
