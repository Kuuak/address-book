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

// Init the currentId cursor
let currentId = 1;
find( {}, result => {
	if ( result.customers.length ) {
		currentId = ( result.customers[ result.customers.length - 1 ]._id + 1 );
	}
} );

function get( id, callback ) {
	dbCustomers.findOne( { _id: parseInt(id) }, (err, doc) => {
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
				message	: 'Impossible de trouver ce client.',
			};
		}

		callback({ success: success, customer: doc, alerts: alert });
	} );
}
function find( query, callback ) {

	query = ( typeof query == 'object' ) ? query : ( isEmpty(query) ? {} : { phone: new RegExp(query) } );

	dbCustomers.find( query, (err, docs) => {

		if ( ! isNull(err) ) {
			callback({
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Une erreur s\'est produite durant la recherche.',
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

	if ( ! success ) {
		callback( {
			fields: fields,
			alerts: alerts,
			redirect: redirect,
		} );
		return;
	}

	let newCustomer = {
		_id				: currentId+1,
		phone			: data.phone.replace( /\D/g, '' ),
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

			// Saves the currentId
			currentId = newDoc._id;

			callback( {
				success: true,
				alerts: {
					icon				: 'done',
					status			: 'success',
					title				: 'Bravo',
					message			: 'Le client a été enregistré.',
					linkButton	: `/customer/${newDoc._id}/`,
					titleButton	: 'Fiche client',
				},
				fields: [],
				redirect: {
					timeout		: 5000,
					to: `/customer/${newDoc._id}`,
				},
			} );
			return;
		}
		else {

			if ( 'uniqueViolated' === err.errorType ) {
				find( data.phone, results => {
					callback({
						success: false,
						alerts: {
							icon				: 'error',
							status			: 'error',
							title				: 'Oups!',
							message			: 'Ce téléphone est déjà enregistré pour un autre client.',
							linkButton	: `/customer/${results.customers[0]._id}/`,
							titleButton	: 'Fiche client',
							timeout			: 0,
						}
					});
				} );
				return;
			}
			else {
				callback({
					success: false,
					alerts: {
						icon		: 'error',
						status	: 'error',
						title		: 'Oups!',
						message	: 'Une erreur c\'est produite. Merci de contacter l\'administrateur.',
					}
				});
			}
		}
	} );

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
		phone			: data.phone.replace( /\D/g, '' ),
		gender		: data.gender,
		firstname	: data.firstname,
		lastname	: data.lastname,
		email			: data.email,
	} };

	dbCustomers.update( { _id: parseInt(data.id) }, customerFields, (err, numUpdated) => {

		if ( isNull(err) && 1 == numUpdated ) {
			success = true;
			alerts	= {
				icon		: 'done',
				status	: 'success',
				title		: 'Bravo',
				message	: 'Le client a été modifié.',
			};
		}
		else if ( !isNull(err) && 'uniqueViolated' === err.errorType ) {
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
function remove( id, callback ) {
	dbCustomers.remove( { _id: parseInt( id ) }, (err, numRemoved) => {
		if( err || 1 !== numRemoved ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de supprimer ce client.',
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

function addressGet( custId, id, callback ) {
	let success = true,
			address = null,
			alert = null;

	get( custId, result => {

		if ( result.success ) {
			address = result.customer.addresses[ result.customer.addresses.findIndex( addr => addr.id == id ) ];
			if ( ! address ) {
				success = false;
				alert = {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de trouver cette adresse.',
				}
			}
		}
		else {
			success = false;
			alert = result.alerts
		}

		callback({
			success: success,
			address: address,
			alerts: alert,
		});
	} );
}
function addressInsert( custId, address, callback ) {

	let { success, fields, alerts } = validateAddress( address );

	if ( ! success ) {
		callback({
				success	: false,
				fields	: fields,
				alerts	: alerts,
		});
		return;
	}

	get( custId, result => {
		if( ! result.success ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de modifier cette adresse, car le client est introuvable.',
				}
			});
			return;
		}
		let customer = result.customer;

		// Make sure that the id is an interger
		address.id = parseInt(address.id);

		// Add Address ID
		address.id = ( 0 == customer.addresses.length ? 1 : parseInt(customer.addresses[customer.addresses.length-1].id) + 1 );

		// Insert new address in customer's addresses
		customer.addresses.push( address );

		// Update customer
		dbCustomers.update( { _id: parseInt(custId) }, customer, {}, ( err, newDoc ) => {

			if ( 1 !== newDoc ) {
				callback({
					success: false,
					alerts: {
						icon		: 'error',
						status	: 'error',
						title		: 'Oups',
						message	: 'L\'adresse n\'a pas pu être enregirée.',
					}
				});
				return;
			}

			callback({
				success	: true,
				address	: newDoc,
				alerts	: {
					icon		: 'done',
					status	: 'success',
					title		: 'Bravo',
					message	: 'L\'adresse à été ajoutée.',
				},
			});
		});
	});
}
function addressUpdate( custId, address, callback ) {

	let { success, fields, alerts } = validateAddress( address );

	if ( isEmpty(address.id) ) {
		success = false;
		alerts.push( {
			icon		: 'error',
			status	: 'error',
			title		: 'Oups',
			message	: 'Impossible de modifier cette adresse.',
		} );
	}

	if ( ! success ) {
		callback({
				success	: false,
				fields	: fields,
				alerts	: alerts,
		});
		return;
	}

	get( custId, (result) => {
		if( ! result.success ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de modifier cette adresse, car le client est introuvable.',
				}
			});
			return;
		}
		let customer = result.customer;

		// Make sure that the id is an interger
		address.id = parseInt(address.id);

		// Add Address ID
		let addrIndex = customer.addresses.findIndex( addr => addr.id == address.id );

		if( ! result.success ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de modifier cette adresse, car celle-ci est est introuvable.',
				}
			});
			return;
		}

		// Replace the addresse with new values
		customer.addresses[addrIndex] = address;

		// Update customer
		dbCustomers.update( { _id: parseInt(custId) }, customer, {}, ( err, numReplaced ) => {

			if ( 1 !== numReplaced ) {
				callback({
					success: false,
					alerts: {
						icon		: 'error',
						status	: 'error',
						title		: 'Oups',
						message	: 'L\'adresse n\'a pas pu être modifiée.',
					}
				});
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
function addressDelete( custId, addrId, callback ) {

	get( custId, result => {
		if( ! result.success ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de supprimer cette adresse, car le client est introuvable.',
				}
			});
			return;
		}

		let customer = result.customer;

		// Find index of address
		let addrIndex = customer.addresses.findIndex( addr => addr.id == addrId );

		// The given addrId does not exists in addresses
		if ( -1 === addrIndex ) {
			callback({
				success: false,
				alerts: {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Impossible de modifier cette adresse, car celle-ci est est introuvable.',
				}
			});
			return;
		}

		// Remove the specified address from adresses
		customer.addresses.splice( addrIndex, 1 )

		dbCustomers.update( { _id: parseInt( custId ) }, customer, {}, ( err, numReplaced ) => {

			if ( 1 !== numReplaced ) {
				callback({
					success: false,
					alerts: {
						icon		: 'error',
						status	: 'error',
						title		: 'Oups',
						message	: 'L\'adresse n\'a pas pu être supprimée.',
					}
				});
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

exports.get			= get;
exports.find		= find;
exports.count		= count;
exports.insert	= insert;
exports.update	= update;
exports.delete	= remove;

exports.addressGet		= addressGet;
exports.addressInsert	= addressInsert;
exports.addressUpdate	= addressUpdate;
exports.addressDelete	= addressDelete;
