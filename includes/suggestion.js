// APP settings
const config = require( '../config.json' );

const vCard = require( 'vcard-json' );
const isNull = require( 'lodash.isnull' );
const isEmpty = require( 'lodash.isempty' );
const request = require( 'request' );
const parseString = require( 'xml2js' ).parseString;

function parseXML( xml, callback ) {

	parseString( xml, (err, result) => {

		if ( ! isNull(err) ) {
			callback( err, null );
			return;
		}

		let data = {
			total: result.feed['openSearch:totalResults'][0],
			links: result.feed.entry.map( entry => entry.link[1]['$'].href ),
		};

		callback( null, data );
	} );

}

function getVcard( link, callback ) {

	request( link, (err, res, body) => {

		let card = vCard.parseVcardString( body, (err, cards) => {
			callback( err, cards[0] );
		});
	} );
}

function find( number, callback ) {

	// retrieve XML
	request( `${config.suggestion.link}${number}`, (err, res, body) => {
		parseXML( body, (err, result) => {

			let vcards = [];

			if ( !isNull(err) || 0 === result.total || isEmpty(result.links) ) {
				callback( err, [] );
				return;
			}

			result.links.forEach( (link, i) => {
				getVcard( link, (err, vcard) => {

					if ( !isNull(err) ) {
						callback( err, [] );
						return;
					}

					vcards.push( {
						title: vcard.fullname,
						phone: vcard.phone[0].value.replace( '+41', '0' ),
						street: vcard.addr[0].street,
						postcode: vcard.addr[0].zip,
						city: vcard.addr[0].city,
						email: ( ! isEmpty(vcard.email[0] ) ? vcard.email[0].value : '' ),
					} );

					if ( i === result.links.length-1 ) {
						callback( null, {
							success			: true,
							suggestions	: vcards,
							totalResults: result.total,
						});
					}
				});
			} );

		});

	} );
}

exports.find = find;
