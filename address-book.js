// Server, Express & Socket.io
const express			= require( 'express' );
const app					= express();
const server			= require( 'http' ).Server( app );
const io					= require( 'socket.io' )( server );
const bodyParser	= require( 'body-parser' ); // Parse the urlencoded format POST data

// Customer related precesses
const customer = require( './includes/customer' );
const suggestion = require( './includes/suggestion' );

// Call Monitor
const fritzMonitor = require( './includes/fritzmonitor' );

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
	.get( '/search/customer/:number?', (req, res) => {
		customer.find( req.params.number, results => res.end( JSON.stringify( results ) ) );
	} )
	.get( '/search/suggestion/:number', (req, res) => {
		suggestion.find( req.params.number, (err, results) => res.end( JSON.stringify( results ) ) );
	} )

	.post( '/customer/add/', (req, res) => {
		customer.add( req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.post( '/customer/edit/', (req, res) => {} )
	.post( '/customer/add/address/', (req, res) => {} )
	.post( '/customer/edit/address/', (req, res) => {} )
	.post( '/customer/delete/', (req, res) => {} )
	.post( '/customer/delete/address/', (req, res) => {} )

	// If request does not match any route
	.use( '/', (req, res) => res.redirect( '/' ) );

/**
 * Socket.io connection handling
 */
io.on( 'connection', socket => fritzMonitor.listen( socket ) );

/**
 * Start server
 */
server.listen( 8080 );
