var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: path.join( __dirname, 'public' ),
	entry: {
		index: [
			'./src/js/index.js'
		]
	},
	devtool: 'source-map',
	output: {
		filename: 'address-book.js',
		path: path.resolve(__dirname, 'public/dist')
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['react']
				}
			}
		]
	}
};
