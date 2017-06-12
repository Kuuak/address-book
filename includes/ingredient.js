/**
 * DATA STRUCTURE
 *
 *	{
 *		_id		: number,
 *		name	: string,
 *		price	: number,
 *	}
 */

// APP settings
const config = require( '../config' );

// Database
const Datastore	= require( 'nedb' );
const dbIngredients	= new Datastore({ filename: `${__dirname}/..${config.database.ingredient}`, autoload: true });

// Helpers
const isNull	= require( 'lodash.isnull' );
const isEmpty	= require( 'lodash.isempty' );

// Init the currentId cursor
let currentId = 1;
find( {}, { _id: 1 }, result => {
	if ( result.ingredients.length ) {
		currentId = ( result.ingredients[ result.ingredients.length - 1 ]._id + 1 );
	}
} );


function find( query, sort, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { _id: new RegExp( query ) } );
	sort	= sort || {};

	dbIngredients.find( query ).sort( sort ).exec( (err, docs) => {

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
			ingredients: docs
		});
	} );

}
function insert( data, callback ) {

	let { success, fields, alerts } = validateIngredient( data );

	if ( !success ) {
		callback({
			success: success,
			fields: fields,
			alerts: alerts,
		});
		return;
	}

	// Make sure that the customer exists
	let newIngredient = {
		_id		: currentId++,
		name	: data.name,
		price	: parseFloat(data.price),
	};

	dbIngredients.insert( newIngredient, (err, newDoc) => {

		if ( isNull(err) ) {
			success = true;
			alerts = {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le supplément est enregistré.',
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
			ingredient		: newDoc,
			alerts	: alerts,
			success	: success,
		} );
	});
}
function update( data, callback ) {

	let { success, fields, alerts } = validateIngredient( data );

	if ( ! success ) {
		callback({ success: success, fields: fields, alerts: alerts });
		return;
	}

	let IngredientFields = { $set: {
		name	: data.name,
		price	: parseFloat(data.price),
	} };

	dbIngredients.update( { _id: parseInt(data._id) }, IngredientFields, (err, numUpdated) => {

		if ( isNull(err) && 1 == numUpdated ) {
			success = true;
			alerts	= {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'L\'ingrédient a été modifié.',
			};
		}
		else {
			success = false;
			alerts = {
				icon		: 'error',
				status	: 'error',
				title		: 'Oups!',
				message	: 'Impossible de modifier cet ingrédient. Merci de contacter l\'administrateur.',
			};
		}

		callback({ success: success, alerts: alerts });

	});

}
function remove( id, callback ) {
	dbIngredients.remove( { _id: parseInt( id ) }, (err, numRemoved) => {
		if( err || 1 !== numRemoved ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de supprimer ce ingrédient.',
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
				message	: 'L\'ingrédient a été supprimé.',
			},
		});
	});
}

function validateIngredient( data ) {

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

	return { success: success, fields: fields, alerts: alerts }
}

exports.find		= find;
exports.insert	= insert;
exports.update	= update;
exports.delete	= remove;
