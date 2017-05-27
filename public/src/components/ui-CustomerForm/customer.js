// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isNil from 'lodash.isnil';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Preloader from 'components/ui-Preloader';
import PhoneInput from 'components/ui-CustomerForm/phone-input'
import AddressInputs from 'components/ui-CustomerForm/address-inputs'
import CustomerInputs from 'components/ui-CustomerForm/customer-inputs'

class CustomerForm extends React.Component {

	constructor( props ) {
		super( props );

		this.handleSubmit = this.handleSubmit.bind( this );

		this.state = {
			processing: false,
		};
	}

	handleSubmit( event ) {
		event.preventDefault();

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		fetch( form.action, {
			method: 'POST',
			body: formData2UrlEncoded( data ),
			headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
		} )
		.then( response => response.json() )
		.then( response => {

			if ( ! isNil(response.alerts) ) {
				this.props.addAlerts( response.alerts );
			}

			if ( ! isNil(response.fields) ) {
				for (let fieldName of response.fields) {
					form.querySelector( `[name="${fieldName}"]` ).classList.add( 'invalid' );
				}
			}

			if ( response.success ) {
				form.reset();
				if ( ! isNil(response.redirect) ) {
					if ( ! isNil(response.redirect.timeout) ) {
						setTimeout( () => this.props.history.push( response.redirect.to ), response.redirect.timeout );
					}
				}
			}
		} );
	}

	render() {
		return (
			<div className="customer-form">
				<h1>Ajouter un client</h1>
				<form onSubmit={this.handleSubmit} className="white" method="POST" action='/customer/'>
					<Preloader active={this.state.processing} />
					<div className="wrapper">
						<PhoneInput phone={ this.props.suggest && this.props.suggest.phone } />
						<AddressInputs address={ this.props.suggest ? `${this.props.suggest.street} ${this.props.suggest.postcode} ${this.props.suggest.city}` : '' } />
						<CustomerInputs firstname={ this.props.suggest && this.props.suggest.title } email={ this.props.suggest && this.props.suggest.email } />
						<div className="fieldset input-wrap btn-wrap">
							<button type="submit" className="btn red btn-large half">Enregistrer</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}
CustomerForm.propTypes = {
	suggest: PropTypes.object,
	history: PropTypes.object.isRequired,
	addAlerts: PropTypes.func.isRequired,
};

export default CustomerForm;
