const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

	entry: {
		index: 'components/ui-App/'
	},

	devtool: 'source-map',

	output: {
		filename: 'address-book.js',
		path: path.resolve(__dirname, 'public/dist'),
		publicPath: '/dist/'
	},

	// Resolve the `./src` directory so we can avoid writing
	// ../../styles/index.css
	resolve: {
		modules: [ './public/src', 'node_modules' ]
	},

	module: {
		loaders: [
			{ test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['react'] } },
			{ test: /\.json$/, loader: 'json-loader' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }) },
			{ test: /\.(png|jp[e]?g)$/, loader: 'file-loader?name=images/[name].[ext]' },
			{ test: /\.woff\d?$/, loader: 'file-loader?name=fonts/[name].[ext]' }
		]
	},

	plugins: [
		new ExtractTextPlugin( "./address-book.css" ),
	]
};
