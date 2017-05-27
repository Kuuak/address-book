// React
import React from 'react';
import PropTypes from 'prop-types';

// Helpers
import isFunction from 'lodash.isfunction';

class PhoneInput extends React.Component {

	render() {
		return (
			<div className="phone-input input-wrap required">
				<label htmlFor="tel" pattern='0\d{2}[\s]\d{3}[\s]\d{2}[\s]\d{2}'>Numéro de téléphone</label>
				<input type="tel" id="tel" name="phone" className="input-phone validate" defaultValue={this.props.phone} required autoComplete="off" />
			</div>
		);
	}
}
PhoneInput.propTypes = {
	phone: PropTypes.string,
};

export default PhoneInput;
