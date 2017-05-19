// Assets depedencies (Style & images)
import 'styles/form.css'
import './index.css'

// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import randomInt from 'includes/randomInt';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Preloader from 'components/ui-Preloader';

// Data
import names from 'components/ui-CustomerAdd/data/names.json';

class CustomerForm extends React.Component {

	constructor( props ) {
		super( props );

		this.handleSubmit				= this.handleSubmit.bind( this );
		this.handleChangePhone	= this.handleChangePhone.bind( this );
		this.handleChangeGender	= this.handleChangeGender.bind( this );

		this.state = {
			phone			: this.props.phone,
			success		: false,
			redirect	: null,
			processing: false,
			name_placeholder: {
				first: names.female[ randomInt(0, names.female.length) ],
				last: names.lastname[ randomInt(0, names.lastname.length) ]
			},
		};
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

			this.setState({ processing: false });

			if ( res.success ) {
				this.props.closeSidebar( true );
				this.props.history.push( `/customer/${this.state.phone}/` );
			}
		} );
	}

	handleChangePhone( event ) {
		this.setState({ phone: event.target.value });
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

	render() {

		return (
			<div className={'customer-form'+ ( this.state.processing ? ' processing' : '' ) }>
				<h2>Modifier le client</h2>
				<form onSubmit={ this.handleSubmit } method="POST" action="/customer/" >
					<input type="hidden" name="_id" value={this.props._id} />
					<Preloader active={this.state.processing} />
					<div className="wrapper">
						<div className="input-wrap required">
							<label htmlFor="tel" pattern='0\d{2}[\s]\d{3}[\s]\d{2}[\s]\d{2}'>Numéro de téléphone</label>
							<input type="tel" id="tel" name="phone" className="input-phone validate" value={this.state.phone} onChange={this.handleChangePhone} required />
						</div>
						<div className="fieldset customer-info">
							<div className="input-wrap full">
								<label className="input-rdo-label">Genre</label>
								<span className="input-rdo">
									<input name="gender" type="radio" id="gender_mrs" value="mrs" defaultChecked onChange={this.handleChangeGender} />
									<label htmlFor="gender_mrs">Madame</label>
								</span>
								<span className="input-rdo">
									<input name="gender" type="radio" id="gender_mr" value="mr" defaultChecked={ 'mr' === this.props.gender } onChange={this.handleChangeGender}/>
									<label htmlFor="gender_mr">Monsieur</label>
								</span>
							</div>
							<div className="input-wrap half">
								<label htmlFor="firstname">Prénom</label>
								<input type="text" id="firstname" name="firstname" defaultValue={ this.props.firstname } placeholder={this.state.name_placeholder.first} />
							</div>
							<div className="input-wrap half">
								<label htmlFor="lastname">Nom</label>
								<input type="text" id="lastname" name="lastname" defaultValue={ this.props.lastname } placeholder={this.state.name_placeholder.last} />
							</div>
							<div className="input-wrap full">
								<label htmlFor="email">Email</label>
								<input type="email" id="email" name="email" defaultValue={ this.props.email } placeholder={ `${this.state.name_placeholder.first}.${this.state.name_placeholder.last}@example.com`.toLowerCase() } />
							</div>
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
CustomerForm.propTypes = {
	phone				: PropTypes.string,
	gender			: PropTypes.string,
	firstname		: PropTypes.string,
	lastname		: PropTypes.string,
	email				: PropTypes.string,
	addAlerts		: PropTypes.func.isRequired,
	closeSidebar: PropTypes.func.isRequired,
};

export default CustomerForm;
