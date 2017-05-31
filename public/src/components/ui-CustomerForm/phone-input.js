// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isFunction from 'lodash.isfunction';
import formatPhone from 'includes/formatPhone';

export default class PhoneInput extends React.Component {

	constructor( props ) {
		super( props );

		this.state = { value: this.props.phone };
		this.handleChange = this.handleChange.bind( this );
	}

	handleChange( event ) {
		this.setState({ value: event.target.value.replace( /\D/g, '') });
	}

	render() {
		return (
			<div className="phone-input input-wrap required">
				<label htmlFor="tel" >Numéro de téléphone</label>
				<input type="tel" id="tel" name="phone" className="input-phone validate" value={ formatPhone(this.state.value) } onChange={ this.handleChange } required autoComplete="off" pattern='0\d{2}[\s]\d{3}[\s]\d{2}[\s]\d{2}' title="Exemple: 021 634 73 37"/>
			</div>
		);
	}
}
PhoneInput.propTypes = {
	phone: PropTypes.string,
};
