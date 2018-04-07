const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const isDev = process.env.NODE_ENV === 'development';

const config  = {
	entry:{
		app: path.join(__dirname,'../client/app.js')
	},
	output:{
		filename: '[name].[hash].js',
		path: path.join(__dirname,'../dist'),
		publicPath: '/public'
	},
	module:{
		rules: [
		  // {
		  //   enforce: 'pre',
		  //   test: /.(js|jsx)$/,
		  //   loader: 'eslint-loader',
		  //   options: {
		  //       emitWarning: true,
		  //       emitError: true,
		  //       useEslintrc: false,
		  //       configFile: path.join(__dirname, "../.eslintrc.json")
		  //   },
		  //   exclude: [
		  //     path.resolve(__dirname, '../node_modules')
		  //   ]
		  // },
		  {
			enforce: 'pre',
			test: /.(js|jsx)$/,
			loader: 'eslint-loader',
			exclude: [
			  path.resolve(__dirname, '../node_modules')
			]
		  },
		  {
			test: /.jsx$/,
			loader: 'babel-loader'
		  },
		  {
			test: /.js$/,
			loader: 'babel-loader',
			exclude: [
			  path.join(__dirname, '../node_modules')
			]
		  }
		]
	},
	plugins: [
	  new HTMLPlugin({
		template: path.join(__dirname, '../client/template.html')
	  })
	]
}

if (isDev) {

	config.entry = {
	  app: [
		'react-hot-loader/patch',
		path.join(__dirname, '../client/app.js')
	  ]
	}
	config.devServer ={
		host: '0.0.0.0',
		port: '8888',
		contentBase: path.join(__dirname, '../dist'),
		hot: true,
		overlay: {
		  errors: true
		},
		publicPath: '/public',
		historyApiFallback: {
		  index: '/public/index.html'
		},
		// proxy: {
		//   '/api': 'http://localhost:3333'
		// }
	}
	config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config