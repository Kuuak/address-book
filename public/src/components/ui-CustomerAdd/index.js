// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import { Redirect } from 'react-router-dom';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import randomInt from 'includes/randomInt';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Preloader from 'components/ui-Preloader';

// Data
import names from './data/names.json';

class CustomerAdd extends React.Component {

	constructor( props ) {
		super( props );

		this.handleSubmit				= this.handleSubmit.bind( this );
		this.fillInAddress			= this.fillInAddress.bind( this );
		this.initAutocomplete		= this.initAutocomplete.bind( this );
		this.handleChangeGender	= this.handleChangeGender.bind( this );

		this.state = {
			success: false,
			redirect: null,
			processing: false,
			name_placeholder: {
				first: names.female[ randomInt(0, names.female.length) ],
				last: names.lastname[ randomInt(0, names.lastname.length) ]
			},
		};
	}

	componentDidMount() {
		if ( !isNull(google.maps.places) ) {

			this.autocomplete = null;
			this.componentForm = {
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

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		if ( isEmpty(data.get( 'email' )) ) {

			let first = ( isEmpty( data.get('firstname') ) ? this.state.name_placeholder.first : data.get('firstname') );
			let last = ( isEmpty( data.get('lastname') ) ? this.state.name_placeholder.last : data.get('lastname') );
			let emailAddress = `${first}.${last}@example.com`;

			data.append( 'random_email', emailAddress.toLowerCase() );
		}

		fetch( form.action, {
			method: 'POST',
			body: formData2UrlEncoded( data ),
			headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
		} )
		.then( response => response.json() )
		.then( response => {

			if ( ! isNull(response.alerts) ) {
				this.props.onAlertsChange( response.alerts );
			}

			if ( ! isNull(response.fields) ) {
				for (let fieldName of response.fields) {
					form.querySelector( `[name="${fieldName}"]` ).classList.add( 'invalid' );
				}
			}

			if ( response.success && ! isNull(response.redirect) ) {
				if ( ! isNull(response.redirect.timeout) ) {
					setTimeout( () => this.setState({ success: response.success, redirect: response.redirect.to }), response.redirect.timeout );
				}
				else {
					this.setState({ success: response.success });
				}
			}
		} );
	}

	handleChangeGender( event ) {

		let gender = ( 'mr' === event.target.value ? 'male' : 'female' );

		this.setState({
			name_placeholder: {
				first: names[gender][ randomInt(0, names[gender].length) ],
				last: names.lastname[ randomInt(0, names.lastname.length) ]
			},
		});
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

		let defaultAddress = Array();
		if ( !isNull(this.props.street) )		{ defaultAddress.push( this.props.street ); }
		if ( !isNull(this.props.postcode) )	{ defaultAddress.push( this.props.postcode ); }
		if ( !isNull(this.props.city) )			{ defaultAddress.push( this.props.city ); }

		return (
			<div className="customer-add">
				{ this.state.success && <Redirect to={this.state.redirect} /> }
				<h1>Ajouter un client</h1>
				<form onSubmit={this.handleSubmit} className="white" method="POST" action='/customer/'>
					<Preloader active={this.state.processing} />
					<div className="wrapper">
						<div className="input-wrap required">
							<label htmlFor="tel" pattern='0\d{2}[\s]\d{3}[\s]\d{2}[\s]\d{2}'>Numéro de téléphone</label>
							<input type="tel" id="tel" name="phone" className="input-phone validate" required defaultValue={ this.props.phone } />
						</div>
						<div className="input-wrap">
							<label htmlFor="address">Adresse</label>
							<input type="search" id="address" defaultValue={ defaultAddress.join(' ') } />
						</div>
						<div className="fieldset address">
							<div className="input-wrap sixt required">
								<label htmlFor="route">Rue</label>
								<input type="text" id="route" name="street" required />
							</div>
							<div className="input-wrap third required">
								<label htmlFor="street_number">Numéro</label>
								<input type="text" id="street_number" name="number" required />
							</div>
							<div className="input-wrap third required">
								<label htmlFor="postal_code">NPA</label>
								<input type="text" id="postal_code" name="postcode" required />
							</div>
							<div className="input-wrap sixt required">
								<label htmlFor="locality">Localité</label>
								<input type="text" id="locality" name="city" required />
							</div>
						</div>
						<div className="fieldset building">
							<div className="input-wrap half">
								<label htmlFor="doorcode">Code de porte</label>
								<input type="text" id="doorcode" name="doorcode"  />
							</div>
							<div className="input-wrap half">
								<label htmlFor="floor">Étage</label>
								<input type="text" id="floor" name="floor"  />
							</div>
						</div>
						<div className="input-wrap">
							<label htmlFor="notes">Information complémentaires</label>
							<textarea id="notes" name="notes" className="materialize-textarea"></textarea>
						</div>
						<div className="fieldset customer-info">
							<div className="input-wrap full">
								<label className="input-rdo-label">Genre</label>
								<span className="input-rdo">
									<input name="gender" type="radio" id="gender_mrs" value="mrs" defaultChecked onChange={this.handleChangeGender}/>
									<label htmlFor="gender_mrs">Madame</label>
								</span>
								<span className="input-rdo">
									<input name="gender" type="radio" id="gender_mr" value="mr" onChange={this.handleChangeGender}/>
									<label htmlFor="gender_mr">Monsieur</label>
								</span>
							</div>
							<div className="input-wrap half">
								<label htmlFor="firstname">Prénom</label>
								<input type="text" id="firstname" name="firstname" placeholder={this.state.name_placeholder.first} defaultValue={ this.props.title }/>
							</div>
							<div className="input-wrap half">
								<label htmlFor="lastname">Nom</label>
								<input type="text" id="lastname" name="lastname" placeholder={this.state.name_placeholder.last} />
							</div>
							<div className="input-wrap full">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" name="email" defaultValue={ this.props.email } placeholder={ `${this.state.name_placeholder.first}.${this.state.name_placeholder.last}@example.com`.toLowerCase() } />
							</div>
						</div>
						<div className="fieldset input-wrap btn-wrap">
							<button type="submit" className="btn red btn-large half">Enregistrer</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default CustomerAdd;
