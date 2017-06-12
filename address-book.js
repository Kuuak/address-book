// APP settings
const config = require( './config' );

// Server, Express & Socket.io
const express			= require( 'express' );
const app					= express();
const server			= require( 'http' ).Server( app );
const io					= require( 'socket.io' )( server );
const bodyParser	= require( 'body-parser' ); // Parse the urlencoded format POST data

// Customer related precesses
const Dish				= require( './includes/dish' );
const Order				= require( './includes/order' );
const Customer		= require( './includes/customer' );
const Suggestion	= require( './includes/suggestion' );
const Ingredient	= require( './includes/ingredient' );

// Call Monitor
const fritzMonitor = require( './includes/fritzmonitor' );

/**
 * Express config & routes handling
 */
app
	.use( express.static( __dirname +'/public' ) )
	.use( bodyParser.urlencoded({ extended: true }) )
	.use( bodyParser.json() )

	// ROUTES
	.get( [ '/', '/dishes-ingredients' ], (req, res) => {
		res.sendFile( __dirname +'/public/index.html' );
	} )
	.get( '/search/customer/:number?', (req, res) => {
		Customer.find( req.params.number, results => res.end( JSON.stringify( results ) ) );
	} )
	.get( '/search/suggestion/:number', (req, res) => {
		Suggestion.find( req.params.number, (err, results) => res.end( JSON.stringify( results ) ) );
	} )

		// View (GET), insert (POST), update (PUT) or delete an address
	.get		( '/customer/:custId/address/:addrId?', (req, res) => {
		if ( req.accepts( 'html' ) ) {
			res.sendFile( __dirname +'/public/index.html' );
		}
		else {
			Customer.addressGet( req.params.custId, req.params.addrId, result => res.end( JSON.stringify( result ) ) );
		}
	} )
	.post		( '/customer/:custId/address/', (req, res) => {
		Customer.addressInsert( req.params.custId, req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.put		( '/customer/:custId/address/', (req, res) => {
		Customer.addressUpdate( req.params.custId, req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.delete	( '/customer/:custId/address/:addrId', (req, res) => {
		Customer.addressDelete( req.params.custId, req.params.addrId, success => res.end( JSON.stringify( success ) ) );
	} )

	// View (GET), insert (POST), update (PUT) or delete a customer
	.get		( '/customer/:custId', (req, res) => {
		if ( req.accepts( 'html' ) ) {
			res.sendFile( __dirname +'/public/index.html' );
		}
		else {
			Customer.get( req.params.custId, result => res.end( JSON.stringify( result ) ) );
		}
	} )
	.post		( '/customer/', (req, res) => {
		Customer.insert( req.body, result => res.status( result.success ? 201 : 200 ).end( JSON.stringify( result ) ) );
	})
	.put		( '/customer/', (req, res) => {
		Customer.update( req.body, result => res.end( JSON.stringify( result ) ) );
	} )
	.delete	( '/customer/:custId', (req, res) => {
		Customer.delete( req.params.custId, result => res.end( JSON.stringify( result ) ) );
	} )

	// View (GET), insert (POST) an order or view (GET) all orders
	.get		( '/order/:orderId', (req, res) => {
		if ( req.accepts( 'html' ) ) {
			res.sendFile( __dirname +'/public/index.html' );
		}
		else {
			Order.get( req.params.orderId, result => res.end( JSON.stringify( result ) ) );
		}
	} )
	.post		( '/order', (req, res) => {
		Order.insert( req.body, result => res.status( result.success ? 201 : 200 ).end( JSON.stringify( result ) ) );
	} )
	.get( '/orders/', (req, res) => {
		if ( req.accepts( 'html' ) ) { res.sendFile( __dirname +'/public/index.html' ); }
		else { Order.find( {}, { date: -1 }, result => res.end( JSON.stringify( result ) ) ); }
	} )

	// Retrieve (GET), insert (POST), update (PUT) or delete dish
	.get( '/dish/:id?', (req, res) => {
		Dish.find( req.params.id, {}, result => res.end( JSON.stringify( result ) ) );
	})
	.post	( '/dish', (req, res) => {
		Dish.insert( req.body, result => res.end( JSON.stringify( result ) ) );
	})

	// Retrieve (GET), insert (POST), update (PUT) or delete ingredient
	.get( '/ingredient/:id?', (req, res) => {
		Ingredient.find( req.params.id, {}, result => res.end( JSON.stringify( result ) ) );
	})
	.post	( '/ingredient', (req, res) => {
		Ingredient.insert( req.body, result => res.end( JSON.stringify( result ) ) );
	})

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

console.log( `Address Book server listening on port ${config.port}.`);
