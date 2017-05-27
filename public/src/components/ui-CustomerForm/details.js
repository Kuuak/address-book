// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Preloader from 'components/ui-Preloader';
import PhoneInput from 'components/ui-CustomerForm/phone-input';
import CustomerInputs from 'components/ui-CustomerForm/customer-inputs';

class CustomerFormDetails extends React.Component {

	constructor( props ) {
		super( props );

		this.handleSubmit = this.handleSubmit.bind( this );

		this.state = {
			loading: false,
		};
	}

	componentDidMount() {
		fetch( `/customer/${this.props.id}/`, { headers: new Headers({ 'Accept': 'application/json' }) } )
			.then( res => res.json() )
			.then( res => {
				this.setState({
					phone			: res.customer.phone,
					gender		: res.customer.gender,
					firstname	: res.customer.firstname,
					lastname	: res.customer.lastname,
					email			: res.customer.email,
				});
			} );
	}

	handleSubmit( event ) {
		event.preventDefault();

		this.setState({ loading: true });

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		fetch( form.action, {
			method: 'PUT',
			body: formData2UrlEncoded( data ),
			headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
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

			this.setState({ loading: false });

			if ( res.success && isFunction(this.props.onSubmitSucess) ) {
				this.props.onSubmitSucess();
			}
		} );
	}

	render() {
		return (
			<div className={ 'customer-form-details'+ ( this.state.loading ? ' loading' : '' ) }>
				<h2>Modifier le client</h2>
				<form onSubmit={ this.handleSubmit } method="POST" action="/customer/" >
					<Preloader active={this.state.loading} />
					<div className="wrapper">
						<input type="hidden" name="id" value={ this.props.id } />
						{( this.state.phone && <PhoneInput phone={ this.state.phone } /> )}
						{( this.state.gender && <CustomerInputs gender={this.state.gender} firstname={this.state.firstname} lastname={this.state.lastname} email={this.state.email} /> )}
						<div className="fieldset input-wrap btn-wrap">
							<button type="submit" className="btn red btn-medium half">Enregistrer</button>
						</div>
					</div>
				</form>
			</div>
		);
	}
}
CustomerFormDetails.propTypes = {
	id						: PropTypes.number.isRequired,
	addAlerts			: PropTypes.func.isRequired,
	onSubmitSucess: PropTypes.func,
};

export default CustomerFormDetails;
