// Server, Express & Socket.io
const express	= require( 'express' );
const app			= express();
const server	= require( 'http' ).Server( app );
const io			= require( 'socket.io' )( server );

// Express Middlewares
const bodyParser = require('body-parser');

/**
 * Express config & routes handling
 */
app
	.use( express.static( __dirname +'/public' ) )
	.use( bodyParser.urlencoded({ extended: true }) )

	// ROUTES
	.get( '/', (req, res) => {
		res.sendFile( __dirname +'/public/index.html' );
	} )
	.get( '/search/:number', (req, res) => {} )
	.post( '/costumer/add/', (req, res) => {} )
	.post( '/costumer/edit/', (req, res) => {} )
	.post( '/costumer/add/address/', (req, res) => {} )
	.post( '/costumer/edit/address/', (req, res) => {} )
	.post( '/costumer/delete/', (req, res) => {} )
	.post( '/costumer/delete/address/', (req, res) => {} )

	// Redirect to root if request does not match any route
	.use( '/', (req, res) => res.redirect( '/' ) );

/**
 * Socket.io connection handling
 */
io.on( 'connection', socket => {

	console.log( 'New io connection');

} );

/**
 * Start server
 */
server.listen( 8080 );
