// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isNull from 'lodash.isnull';

class AddressInputs extends React.Component {

	constructor( props ) {
		super( props );

		this.fillInAddress		= this.fillInAddress.bind( this );
		this.initAutocomplete	= this.initAutocomplete.bind( this );
	}

	componentDidMount() {
		if ( ! isNull(google.maps.places) ) {

			this.autocomplete		= null;
			this.componentForm	= {
				street_number	: 'short_name',
				route					: 'long_name',
				locality			: 'long_name',
				postal_code		: 'short_name'
			};

			this.initAutocomplete();
		}
	}

	initAutocomplete() {
		/** @see https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform */
		// Create the autocomplete object, restricting the search to geographical location types.
		this.autocomplete = new google.maps.places.Autocomplete(
			document.getElementById('address'),
			{
				types: ['geocode'],
				componentRestrictions: {
					country: 'ch'
				}
			}
		);

		// When the user selects an address from the dropdown, populate the address fields in the form.
		this.autocomplete.addListener( 'place_changed', this.fillInAddress );
	}
	fillInAddress() {
		/** @see https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform */
		// Get the place details from the autocomplete object.
		let place = this.autocomplete.getPlace();

		// Get each component of the address from the place details
		// and fill the corresponding field on the form.
		for (let i = 0; i < place.address_components.length; i++) {
			let addressType = place.address_components[i].types[0];
			if (this.componentForm[addressType]) {
				document.getElementById(addressType).value = place.address_components[i][this.componentForm[addressType]];
			}
		}
	}

	render() {

		return (
			<div className="address-inputs">
				<div className="input-wrap">
					<label htmlFor="address">Adresse</label>
					<input type="search" id="address" defaultValue={ this.props.address } autoComplete="off" />
				</div>
				<div className="fieldset address">
					<div className="input-wrap sixt required">
						<label htmlFor="route">Rue</label>
						<input type="text" id="route" name="street" defaultValue={ this.props.street } required autoComplete="off" />
					</div>
					<div className="input-wrap third required">
						<label htmlFor="street_number">Numéro</label>
						<input type="text" id="street_number" name="number" defaultValue={ this.props.number } required autoComplete="off" />
					</div>
					<div className="input-wrap third required">
						<label htmlFor="postal_code">NPA</label>
						<input type="text" id="postal_code" name="postcode" defaultValue={ this.props.postcode } required autoComplete="off" />
					</div>
					<div className="input-wrap sixt required">
						<label htmlFor="locality">Localité</label>
						<input type="text" id="locality" name="city" defaultValue={ this.props.city } required autoComplete="off" />
					</div>
				</div>
				<div className="fieldset building">
					<div className="input-wrap half">
						<label htmlFor="doorcode">Code de porte</label>
						<input type="text" id="doorcode" name="doorcode" defaultValue={ this.props.doorcode } autoComplete="off" />
					</div>
					<div className="input-wrap half">
						<label htmlFor="floor">Étage</label>
						<input type="text" id="floor" name="floor" defaultValue={ this.props.floor } autoComplete="off" />
					</div>
				</div>
				<div className="input-wrap">
					<label htmlFor="notes">Information complémentaires</label>
					<textarea id="notes" name="notes" className="materialize-textarea" defaultValue={ this.props.notes }></textarea>
				</div>
			</div>
		);
	}
}
AddressInputs.propTypes = {
	address	: PropTypes.string,
	street	: PropTypes.string,
	number	: PropTypes.string,
	postcode: PropTypes.string,
	city		: PropTypes.string,
	doorcode: PropTypes.string,
	floor		: PropTypes.string,
	notes		: PropTypes.string,
};

export default AddressInputs;
