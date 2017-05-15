// APP settings
const config = require( '../config' );

const CallMonitor = require( 'node-fritzbox-callmonitor' );

function listen( socket ) {

	const monitor = new CallMonitor( config.fritzbox.address, config.fritzbox.port );

	monitor
		.on( 'inbound', call => socket.emit( 'inbound', call.caller ) )
		.on( 'connected', call => socket.emit( 'connected', call.caller ) )
		.on( 'disconnected', call => socket.emit( 'disconnected', call.caller ) )
		.on( 'error', error => {
			switch (error.code) {
				case 'ENETUNREACH':
					console.error( `Cannot reach ${error.address}:${error.port}. Please check your connection.` );
					break;
				case 'ECONNREFUSED':
					console.error( `Connection refused on ${error.address}:${error.port}` );
					break;
				case 'ETIMEDOUT':
					console.error( `Connection timeout on ${error.address}:${error.port}.` );
					break;
				default:
					console.error( `Error: node-fritzbox-callmonitor - error.code` );
					break;
			}
		});
}

exports.listen = listen;
