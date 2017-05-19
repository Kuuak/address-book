// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Preloader from 'components/ui-Preloader';


class AddressForm extends React.Component {

	constructor( props ) {
		super( props );

		this.handleSubmit			= this.handleSubmit.bind( this );
		this.fillInAddress		= this.fillInAddress.bind( this );
		this.initAutocomplete	= this.initAutocomplete.bind( this );

		this.state = {
			success		: false,
			redirect	: null,
			processing: false,
		};
	}

	componentDidMount() {
		if ( !isNull(google.maps.places) ) {

			this.autocomplete		= null;
			this.componentForm	= {
				street_number: 'short_name',
				route: 'long_name',
				locality: 'long_name',
				postal_code: 'short_name'
			};

			this.initAutocomplete();
		}
	}

	handleSubmit( event ) {
		event.preventDefault();

		this.setState({ processing: true });

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		fetch( form.action, {
			body		: formData2UrlEncoded( data ),
			method	: ( this.props.id ? 'PUT' : 'POST' ),
			headers	: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
		} )
		.then( res => res.json() )
		.then( res => {

			if ( ! isEmpty(res.alerts) ) {
				this.props.addAlerts( res.alerts );
			}

			if ( ! isEmpty(res.fields) ) {
				for (let fieldName of res.fields) {
					form.querySelector( `[name="${fieldName}"]` ).classList.add( 'invalid' );
				}
			}

			if ( res.success ) {
				this.props.closeSidebar( true );
			}

			this.setState({ processing: false });
		} );
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
			<div className={'address-form'+ ( this.state.processing ? ' processing' : '' ) }>
				<h2>{ this.props.id ? 'Modifier l\'adresse' : 'Ajouter une adresse' }</h2>
				<form onSubmit={ this.handleSubmit } method="POST" action={ `/customer/${this.props.phone}/address/` }>
					<Preloader active={this.state.processing} />
					<div className="wrapper">
						<div className="input-wrap">
							<label htmlFor="address">Adresse</label>
							<input type="search" id="address" defaultValue="" />
						</div>
						{ this.props.id && <input type="hidden" name="id" value={this.props.id} /> }
						<div className="fieldset address">
							<div className="input-wrap sixt required">
								<label htmlFor="route">Rue</label>
								<input type="text" id="route" name="street" defaultValue={ this.props.street } required />
							</div>
							<div className="input-wrap third required">
								<label htmlFor="street_number">Numéro</label>
								<input type="text" id="street_number" name="number" defaultValue={ this.props.number } required />
							</div>
							<div className="input-wrap third required">
								<label htmlFor="postal_code">NPA</label>
								<input type="text" id="postal_code" name="postcode" defaultValue={ this.props.postcode } required />
							</div>
							<div className="input-wrap sixt required">
								<label htmlFor="locality">Localité</label>
								<input type="text" id="locality" name="city" defaultValue={ this.props.city } required />
							</div>
						</div>
						<div className="fieldset building">
							<div className="input-wrap half">
								<label htmlFor="doorcode">Code de porte</label>
								<input type="text" id="doorcode" name="doorcode" defaultValue={ this.props.doorcode }  />
							</div>
							<div className="input-wrap half">
								<label htmlFor="floor">Étage</label>
								<input type="text" id="floor" name="floor" defaultValue={ this.props.floor }  />
							</div>
						</div>
						<div className="input-wrap">
							<label htmlFor="notes">Information complémentaires</label>
							<textarea id="notes" name="notes" className="materialize-textarea" defaultValue={ this.props.notes }></textarea>
						</div>
						<div className="fieldset input-wrap btn-wrap">
							<button type="submit" className="btn red btn-medium half">Enregistrer</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}
AddressForm.propTypes = {
	id					: PropTypes.number,
	number			: PropTypes.string,
	street			: PropTypes.string,
	postcode		: PropTypes.string,
	city				: PropTypes.string,
	doorcode		: PropTypes.string,
	floor				: PropTypes.string,
	notes				: PropTypes.string,
	addAlerts		: PropTypes.func.isRequired,
	closeSidebar: PropTypes.func.isRequired,
};

export default AddressForm;
