// APP settings
const config = require( './config' );

// Server, Express & Socket.io
const express			= require( 'express' );
const app					= express();
const server			= require( 'http' ).Server( app );
const io					= require( 'socket.io' )( server );
const bodyParser	= require( 'body-parser' ); // Parse the urlencoded format POST data

// Customer related precesses
const Customer		= require( './includes/customer' );
const Suggestion	= require( './includes/suggestion' );

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
		Customer.find( req.params.number, results => res.end( JSON.stringify( results ) ) );
	} )
	.get( '/search/suggestion/:number', (req, res) => {
		Suggestion.find( req.params.number, (err, results) => res.end( JSON.stringify( results ) ) );
	} )

	// View (GET), insert (POST), update (PUT) or delete a customer
	.get		( '/customer/(:number)|(:number/edit)', (req, res) => {
		res.sendFile( __dirname +'/public/index.html' );
	} )
	.post		( '/customer/', (req, res) => {
		Customer.insert( req.body, result => res.status( result.success ? 201 : 200 ).end( JSON.stringify( result ) ) );
	})
	.put		( '/customer/', (req, res) => {
		Customer.update( req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.delete	( '/customer/:number', (req, res) => {
		Customer.delete( req.params.number, result => res.end( JSON.stringify( result ) ) );
	} )

	// View (GET), insert (POST), update (PUT) or delete an address
	.get		( '/customer/:number/address/((:addrId/edit)|add)?', (req, res) => {
		res.sendFile( __dirname +'/public/index.html' );
	} )
	.post		( '/customer/:number/address/', (req, res) => {
		Customer.addressInsert( req.params.number, req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.put		( '/customer/:number/address/', (req, res) => {
		Customer.addressUpdate( req.params.number, req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.delete	( '/customer/:number/address/:addrId', (req, res) => {
		Customer.addressDelete( req.params.number, req.params.addrId, success => res.end( JSON.stringify( success ) ) );
	} )

	// If request does not match any route
	.use( '/', (req, res) => res.redirect( '/' ) );

/**
 * Socket.io connection handling
 */
io.on( 'connection', socket => fritzMonitor.listen( socket ) );

/**
 * Start server
 */
server.listen( config.port );
