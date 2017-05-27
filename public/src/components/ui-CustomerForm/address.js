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
import AddressInputs from 'components/ui-CustomerForm/address-inputs';


class AddressForm extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
		};

		this.handleSubmit = this.handleSubmit.bind( this );
	}

	componentDidMount() {
		if ( isNaN(this.props.id) ) {
			this.setState({ address: {} });
		}
		else {
			fetch( `/customer/${this.props.custId}/address/${this.props.id}/`, { headers: new Headers({ 'Accept': 'application/json' }) } )
				.then( res => res.json() )
				.then( res => {
					this.setState({ address: res.address });
				} );
		}
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

				this.setState({ loading: false });

				if ( res.success && isFunction(this.props.onSubmitSucess)) {
					this.props.onSubmitSucess();
				}
			} );
	}

	render() {
		return (
			<div className={'address-form'+ ( this.state.loading ? ' loading' : '' ) }>
				<h2>{ this.props.id ? 'Modifier l\'adresse' : 'Ajouter une adresse' }</h2>
				<form onSubmit={ this.handleSubmit } method="POST" action={ `/customer/${this.props.custId}/address/` }>
					<Preloader active={this.state.loading} />
					<div className="wrapper">
						{ !isNaN(this.props.id) && <input type="hidden" name="id" value={ this.props.id } /> }
						{( this.state.address && <AddressInputs { ...this.state.address } /> )}
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
	id						: PropTypes.number,
	custId				: PropTypes.number.isRequired,
	addAlerts			: PropTypes.func.isRequired,
	onSubmitSucess: PropTypes.func,
};

export default AddressForm;
