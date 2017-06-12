/**
 * DATA STRUCTURE
 *
 *	{
 *		_id		: number,
 *		name	: string,
 *		price	: number,
 *		desc	: string, Optional.
 *	}
 */

// APP settings
const config = require( '../config' );

// Database
const Datastore	= require( 'nedb' );
const dbDishes	= new Datastore({ filename: `${__dirname}/..${config.database.dish}`, autoload: true });

// Helpers
const isNull	= require( 'lodash.isnull' );
const isEmpty	= require( 'lodash.isempty' );

// Init the currentId cursor
let currentId = 1;
find( {}, { _id: 1 }, result => {
	if ( result.dishes.length ) {
		currentId = ( result.dishes[ result.dishes.length - 1 ]._id + 1 );
	}
} );


function find( query, sort, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { _id: new RegExp( query ) } );
	sort	= sort || {};

	dbDishes.find( query ).sort( sort ).exec( (err, docs) => {

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
			dishes: docs
		});
	} );

}
function insert( data, callback ) {

	let { success, fields, alerts } = validateDish( data );

	if ( !success ) {
		callback({
			success: success,
			fields: fields,
			alerts: alerts,
		});
		return;
	}

	// Make sure that the customer exists
	let newDish = {
		_id		: currentId++,
		name	: data.name,
		price	: parseFloat(data.price),
		desc	: isEmpty(data.desc) ? '' : data.desc,
	};

	dbDishes.insert( newDish, (err, newDoc) => {

		if ( isNull(err) ) {
			success = true;
			alerts = {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le plat est enregistré.',
			};
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
			dish		: newDoc,
			alerts	: alerts,
			success	: success,
		} );
	});
}
function update( data, callback ) {

	let { success, fields, alerts } = validateDish( data );

	if ( ! success ) {
		callback({ success: success, fields: fields, alerts: alerts });
		return;
	}

	let dishFields = { $set: {
		name	: data.name,
		price	: parseFloat(data.price),
		desc	: isEmpty(data.desc) ? '' : data.desc,
	} };

	dbDishes.update( { _id: parseInt(data._id) }, dishFields, (err, numUpdated) => {

		if ( isNull(err) && 1 == numUpdated ) {
			success = true;
			alerts	= {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le plat a été modifié.',
			};
		}
		else {
			success = false;
			alerts = {
				icon		: 'error',
				status	: 'error',
				title		: 'Oups!',
				message	: 'Impossible de modifier ce plat. Merci de contacter l\'administrateur.',
			};
		}

		callback({ success: success, alerts: alerts });

	});

}
function remove( id, callback ) {
	dbDishes.remove( { _id: parseInt( id ) }, (err, numRemoved) => {
		if( err || 1 !== numRemoved ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de supprimer ce plat.',
				},
			});
			return;
		}

		callback({
			success: true,
			alerts: {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le plat a été supprimé.',
			},
		});
	});
}

function validateDish( data ) {

	let success = true,
			fields	= [],
			alerts	= [];

	if ( isEmpty(data.name) ) {
		success = false;
		fields.push( 'name' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Veuillez saisir un nom.',
		} );
	}
	if ( isEmpty(data.price) ) {
		success = false;
		fields.push( 'price' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Veuillez saisir un prix.',
		} );
	}

	return { success: success, fields: fields, alerts: alerts }
}

exports.find		= find;
exports.insert	= insert;
exports.update	= update;
exports.delete	= remove;
