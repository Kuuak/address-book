/**
 * DATA STRUCTURE
 *
 *	{
 *		_id			: number,
 *		customer: object, Customer reference
 *		{
 *			_id				: string, Customer's id reference
 *			phone			: string,
 *			gender		: string,
 *			firstname	: string,
 *			lastname	: string,
 *		},
 *		address	: object, Address reference
 *		{
 *			id		: string, Customer's Address id reference
 *			street	: string,
 *			number	: string,
 *			postcode: string,
 *			city		: string,
 *			doorcode: string,
 *			floor		: string,
 *			notes		: string,
 *		},
 *		date				: string, Timestamp
 *		information	: string, Optional. Additional info
 *		payment			: string, Method of payment
 *		items				: array,	Optional. Dished ordered
 *		[{
 *			id			: number, incremential number
 *			dish		: number, Dish id reference
 *			name		: string, Dish's name
 *			price		: number, Dish's price
 *			extra		: array, Optional.
 *			[{
 *				ingredient: number, ingredient id reference
 *				type			: string, Additional or without
 *				name			: string, ingredient's name
 *				price			: number, ingredient's price
 *			}, {...}, {...n}],
 *		}, {...}, {...n}],
 *	}
 */

// APP settings
const config = require( '../config' );

// Database
const Datastore	= require( 'nedb' );
const dbOrders	= new Datastore({ filename: `${__dirname}/..${config.database.order}`, autoload: true });

// Set indexing on cutomer & address to speed up queries
dbOrders.ensureIndex({ fieldName: 'customer' });
dbOrders.ensureIndex({ fieldName: 'address' });


// Helpers
const isNull	= require( 'lodash.isnull' );
const isEmpty	= require( 'lodash.isempty' );

// Access to customer database
const Customer = require( './customer' );

// Init the currentId cursor
let currentId = 0;
find( {}, { _id: 1 }, result => {
	if ( result.orders.length ) {
		currentId = ( result.orders[ result.orders.length - 1 ]._id + 1 );
	}
} );


function get( id, callback ) {
	dbOrders.findOne( { _id: parseInt(id) }, (err, doc) => {
		let success = true,
				alert		= null;

		if ( ! isNull(err) ) {
			success = false;
			alert = {
				icon		: 'error',
				status	: 'error',
				title		: 'Oups',
				message	: 'Une erreur s\'est produite durant la recherche.',
			};
		}
		else if ( isNull(doc) ) {
			success = false;
			alert = {
				icon		: 'error',
				status	: 'error',
				title		: 'Oups',
				message	: 'Impossible de trouver la commande.',
			};
		}

		callback({ success: success, order: doc, alerts: alert });
	} );
}
function find( query, sort, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { _id: new RegExp( query ) } );
	sort	= sort || {};

	dbOrders.find( query ).sort( sort ).exec( (err, docs) => {

		if ( ! isNull(err) ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Une erreur s\'est produite durant la recherche. Merci de contacter l\'administrateur si cela continue.',
				}
			});
			return;
		}

		callback({
			success: true,
			orders: docs
		});
	} );

}
function insert( data, callback ) {

	let { success, fields, alerts } = validateOrder( data );

	if ( !success ) {
		callback({
			success: success,
			fields: fields,
			alerts: alerts,
		});
		return;
	}

	// Make sure that the customer exists
	Customer.get( data.customer, customer => {

		if ( ! customer.success ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups!',
					message	: 'Ce client n\'existe pas. Veuillez enregister le client avant de passer commande.',
				}
			});
			return;
		}

		// Shorten access
		customer = customer.customer;

		let addressIndex = customer.addresses.findIndex( addr => addr.id == data.address );

		if ( -1 == addressIndex ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups!',
					message	: 'L\'adresse n\'existe pas. Veuillez enregister l\'adresse avant de passer commande.',
				}
			});
			return;
		}

		let address = customer.addresses[ addressIndex ];

		// Remove unwanted data from customer
		delete customer.addresses;

		let newOrder = {
			_id					: currentId + 1,
			customer		: customer,
			address			: address,
			date				: Date.now(),
			payment			: data.payment,
			information	: data.information,
			items				: isEmpty(data.items) ? [] : data.items,
		};

		dbOrders.insert( newOrder, (err, newDoc) => {

			if ( isNull(err) ) {
				success = true;
				alerts = {
					icon		: 'done',
					status	: 'success',
					title		: 'Bravo',
					message	: 'La commande est enregistrée.',
				};
				currentId = newDoc._id;
			}
			else {
				success = false;
				alerts.push( {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups!',
					message	: 'Une erreur c\'est produite. Merci de contacter l\'administrateur.',
				} );
			}

			callback( {
				order		: newDoc,
				alerts	: alerts,
				success	: success,
			} );
		});
	} );
}

function validateOrder( data ) {

	let success = true,
			fields	= [],
			alerts	= [];

	if ( isNull(data.customer) ) {
		success = false;
		fields.push( 'customer' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Veuillez de sélectionner un client.',
		} );
	}
	if ( isNull(data.address) ) {
		success = false;
		fields.push( 'address' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Veuillez de sélectionner une adresse de livraison.',
		} );
	}
	if ( isEmpty(data.payment) ) {
		success = false;
		fields.push( 'payment' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Veuillez de sélectionner une méthode de payement.',
		} );
	}

	return { success: success, fields: fields, alerts: alerts }
}

exports.get			= get;
exports.find		= find;
exports.insert	= insert;
