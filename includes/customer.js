const isNull	= require( 'lodash.isnull' );
const isEmpty	= require( 'lodash.isempty' );
const Isemail	= require( 'isemail' );

// APP settings
const config = require( '../config.json' );

// Database
const Datastore		= require( 'nedb' );
const dbCustomers	= new Datastore({ filename: `${__dirname}/..${config.database.customers}`, autoload: true });

// Set unique constraint to phone field
dbCustomers.ensureIndex({ fieldName: 'phone', unique: true });

function add( data, callback ) {

	let success		= true,
			fields		= [],
			alerts		= [],
			redirect	= {};

	if ( isEmpty(data.phone) ) {
		success = false;
		fields.push( 'phone' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Le téléphone est obligatoire.',
		} );
	}
	if ( isEmpty(data.street) ) {
		success = false;
		fields.push( 'street' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'La rue est obligatoire.',
		} );
	}
	if ( isEmpty(data.number) ) {
		success = false;
		fields.push( 'number' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Le numero est obligatoire.',
		} );
	}
	if ( isEmpty(data.postcode) ) {
		success = false;
		fields.push( 'postcode' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Le NPA est obligatoire.',
		} );
	}
	if ( isEmpty(data.city) ) {
		success = false;
		fields.push( 'city' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'La localité est obligatoire.',
		} );
	}
	if ( !isEmpty(data.email) && !Isemail.validate(data.email) ) {
		success = false;
		fields.push( 'email' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Cette adresse email n\'est pas valide.',
		} );
	}

	if ( success ) {

		let newCustomer = {
			phone			: data.phone,
			gender		: data.gender,
			firstname	: data.firstname,
			lastname	: data.lastname,
			email			: data.email,
			addresses	: [ {
				street		: data.street,
				number		: data.number,
				postcode	: data.postcode,
				city			: data.city,
				doorcode	: data.doorcode,
				floor			: data.floor,
				notes			: data.notes,
			} ]
		};

		dbCustomers.insert( newCustomer , (err, newDoc) => {

			if ( isNull(err) ) {
				alerts.push( {
					icon				: 'done',
					status			: 'success',
					title				: 'Bravo',
					message			: 'Le client à bien été enregistré.',
					linkButton	: `/costumer/${data.phone}`,
					titleButton	: 'Fiche client',
				} );

				redirect = {
					timeout		: 5000,
					to: `/costumer/${data.phone}`,
				};
			}
			else if ( 'uniqueViolated' === err.errorType ) {
				success = false;
				alerts.push( {
					icon				: 'error',
					status			: 'error',
					title				: 'Oups!',
					message			: 'Ce téléphone est déjà enregistré pour un autre client.',
					linkButton	: `/costumer/${data.phone}`,
					titleButton	: 'Fiche client',
					timeout			: 0,
				} );
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
				success: success,
				fields: fields,
				alerts: alerts,
				redirect: redirect,
			} );
		} );

	}
	else {
		callback( {
			fields: fields,
			alerts: alerts,
			redirect: redirect,
		} );
	}

};

function find( number, callback ) {

	let query = ( (! isEmpty(number)) ? { phone: new RegExp( number ) } : {} );

	dbCustomers.find( query, (err, docs) => {

		if ( ! isNull(err) ) {
			callback({ alerts: [{
				icon		: 'error',
				status	: 'error',
				title		: 'Oups',
				message	: 'Une erreur s\'est produite durant la recherche. Merci de contacter l\'administrateur si cela continue.',
			}] });

			return;
		}

		callback( { customers: docs } );
	} );

}

exports.add = add;
exports.find = find;
