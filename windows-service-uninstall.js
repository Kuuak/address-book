const path = require('path');
const Service = require( 'node-windows' ).Service;

// Create a new service object
var svc = new Service({
	name				:'Address Book',
	script			: path.join( __dirname, 'address-book.js' )
});

// Listen for the "uninstall" event so we know when it's done.
svc.on( 'uninstall', () => {
	console.log( svc.name+' service stopped!' );
} );

// Uninstall the service.
svc.uninstall();
