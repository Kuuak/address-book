const path = require('path');
const Service = require( 'node-windows' ).Service;

// Create a new service object
var svc = new Service({
	name				:'Address Book',
	description	: 'Address Book node.js server.',
	script			: path.join( __dirname, 'address-book.js' )
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on( 'install', () => svc.start() );

// Listen for the "start" event and let us know when the
// process has actually started working.
svc.on('start', () => console.log( svc.name+' service started!' ) );

// Install the script as a service.
svc.install();
