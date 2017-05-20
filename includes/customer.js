const isNull	= require( 'lodash.isnull' );
const isEmpty	= require( 'lodash.isempty' );
const Isemail	= require( 'isemail' );

// // APP settings
const config = require( '../config' );

// Database
const Datastore		= require( 'nedb' );
const dbCustomers	= new Datastore({ filename: `${__dirname}/..${config.database.customers}`, autoload: true });

// Set unique constraint to phone field
dbCustomers.ensureIndex({ fieldName: 'phone', unique: true });

function find( query, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { phone: new RegExp( query ) } );

	dbCustomers.find( query, (err, docs) => {

		if ( ! isNull(err) ) {
			callback({
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Une erreur s\'est produite durant la recherche. Merci de contacter l\'administrateur si cela continue.',
				}
			});

			return;
		}

		callback( { customers: docs } );
	} );

}
function count( query, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { phone: new RegExp( query ) } );

	dbCustomers.count( query, (err, count) => {
		callback( count );
	} );

}
function insert( data, callback ) {

	let redirect	= {},
			{ success, fields, alerts } = validateAddress( data );

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
				id				: 1,
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
					message			: 'Le client a été enregistré.',
					linkButton	: `/customer/${data.phone}/`,
					titleButton	: 'Fiche client',
				} );

				redirect = {
					timeout		: 5000,
					to: `/customer/${data.phone}`,
				};
			}
			else if ( 'uniqueViolated' === err.errorType ) {
				success = false;
				alerts.push( {
					icon				: 'error',
					status			: 'error',
					title				: 'Oups!',
					message			: 'Ce téléphone est déjà enregistré pour un autre client.',
					linkButton	: `/customer/${data.phone}/`,
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
function update( data, callback ) {

	let success		= true,
			fields		= [],
			alerts		= [];

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

	if ( ! success ) {
		callback({ success: success, fields: fields, alerts: alerts });
		return;
	}

	let customerFields = { $set: {
		phone			: data.phone,
		gender		: data.gender,
		firstname	: data.firstname,
		lastname	: data.lastname,
		email			: data.email,
	} };

	dbCustomers.update( { _id: new RegExp( data._id ) }, customerFields, (err, numUpdated) => {

		if ( isNull(err) && 1== numUpdated ) {
			success = true;
			alerts	= {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le client a été modifié.',
			};
		}
		else if ( 'uniqueViolated' === err.errorType ) {
			success = false;
			alerts = {
				icon				: 'error',
				status			: 'error',
				title				: 'Oups!',
				message			: 'Ce téléphone est déjà enregistré pour un autre client.',
			};
		}
		else {
			success = false;
			alerts = {
				icon		: 'error',
				status	: 'error',
				title		: 'Oups!',
				message	: 'Impossible de modifier ce client. Merci de contacter l\'administrateur.',
			};
		}

		callback({ success: success, alerts: alerts });

	});

}
function remove( number, callback ) {
	dbCustomers.remove( { phone: new RegExp( number ) }, (err, numRemoved) => {
		if( err || 1 !== numRemoved ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de supprimer ce client. Contacter l\'administrateur si cela continue.',
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
				message	: 'Le client a été supprimé.',
			},
		});
	});
}

function validateAddress( address ) {

	let success		= true,
			fields		= [],
			alerts		= [];

	if ( isEmpty(address.street) ) {
		success = false;
		fields.push( 'street' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'La rue est obligatoire.',
		} );
	}
	if ( isEmpty(address.number) ) {
		success = false;
		fields.push( 'number' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Le numero est obligatoire.',
		} );
	}
	if ( isEmpty(address.postcode) ) {
		success = false;
		fields.push( 'postcode' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Le NPA est obligatoire.',
		} );
	}
	if ( isEmpty(address.city) ) {
		success = false;
		fields.push( 'city' );
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'La localité est obligatoire.',
		} );
	}

	return { success: success, fields: fields, alerts: alerts };
}

function addressInsert( number, address, callback ) {

	let { success, fields, alerts } = validateAddress( address );

	if ( ! success ) {
		callback({
				success	: false,
				fields	: fields,
				alerts	: alerts,
		});
		return;
	}

	find( number, (result) => {
		if( 1 !== result.customers.length ) {
			callback({ success: false });
			return;
		}
		let customer = result.customers[0];

		// Add Address ID
		address.id = ( 0 == customer.addresses.length ? 1 : parseInt(customer.addresses[customer.addresses.length-1].id) + 1 );

		// Insert new address in customer's addresses
		customer.addresses.push( address );

		// Update customer
		dbCustomers.update( { phone: new RegExp( number ) }, customer, {}, ( err, numReplaced ) => {

			if ( 1 !== numReplaced ) {
				callback({ success: false });
				return;
			}

			callback({
				success	: true,
				alerts	: {
					icon		: 'done',
					status	: 'success',
					title		: 'Bravo',
					message	: 'L\'adresse à été ajoutée.',
				}
			});
		});
	});
}
function addressUpdate( number, address, callback ) {

	let { success, fields, alerts } = validateAddress( address );

	if ( isEmpty(address.id) ) {
		success = false;
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Impossible de modifier cette adresse. Contacter l\'administrateur si cela continue.',
		} );
	}

	// Make sure that the id is an interger
	address.id = parseInt(address.id);

	if ( ! success ) {
		callback({
				success	: false,
				fields	: fields,
				alerts	: alerts,
		});
		return;
	}

	find( number, (result) => {
		if( 1 !== result.customers.length ) {
			callback({ success: false });
			return;
		}
		let customer = result.customers[0];

		// Add Address ID
		let addrIndex = customer.addresses.findIndex( addr => addr.id == address.id );

		if( 1 !== result.customers.length ) {
			callback({ success: false, error: 'did not find address' });
			return;
		}

		// Replace the addresse with new values
		customer.addresses[addrIndex] = address;

		// Update customer
		dbCustomers.update( { phone: new RegExp( number ) }, customer, {}, ( err, numReplaced ) => {

			if ( 1 !== numReplaced ) {
				callback({ success: false });
				return;
			}

			callback({
				success	: true,
				alerts	: {
					icon		: 'done',
					status	: 'success',
					title		: 'Bravo',
					message	: 'L\'adresse à été modifiée.',
				}
			});
		});
	});
}
function addressDelete( number, addrId, callback ) {

	find( number, (result) => {
		if( 1 !== result.customers.length ) {
			callback({ success: false, error: 'did not find number' });
			return;
		}

		let customer = result.customers[0];

		// Find index of address
		let addrIndex = customer.addresses.findIndex( addr => addr.id == addrId );

		// The given addrId does not exists in addresses
		if ( -1 === addrIndex ) {
			callback({ success: false, error: 'findIndex -1' });
			return;
		}

		// Unable to remove the specified address from adresses
		if ( -1 === customer.addresses.splice( addrIndex, 1 ).length ) {
			callback({ success: false, error: 'splice -1' });
			return;
		}

		dbCustomers.update( { phone: new RegExp( number ) }, customer, {}, ( err, numReplaced ) => {

			if ( 1 !== numReplaced ) {
				callback({ success: false, error: 'numReplaced 0' });
				return;
			}

			callback({
				success	: true,
				alerts	: {
					icon		: 'done',
					status	: 'success',
					title		: 'Succès',
					message	: "L'adresse a été supprimée.",
				}
			});
		});
	});
}

exports.find		= find;
exports.count		= count;
exports.insert	= insert;
exports.update	= update;
exports.delete	= remove;

exports.addressInsert	= addressInsert;
exports.addressUpdate	= addressUpdate;
exports.addressDelete	= addressDelete;
