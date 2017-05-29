// React
import React from 'react';
import PropTypes from 'prop-types';

// Data
import genderNames from './data/names.json';

// Helpers
import randomInt from 'includes/randomInt';

export default class CustomerInputs extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			name_placeholder: {
				first: genderNames.female[ randomInt(0, genderNames.female.length) ],
				last: genderNames.lastname[ randomInt(0, genderNames.lastname.length) ]
			},
		};

		this.handleChangeGender	= this.handleChangeGender.bind( this );
	}

	handleChangeGender( event ) {

		let gender = ( 'mr' === event.target.value ? 'male' : 'female' );

		this.setState({
			name_placeholder: {
				first: genderNames[gender][ randomInt(0, genderNames[gender].length) ],
				last: genderNames.lastname[ randomInt(0, genderNames.lastname.length) ]
			},
		});
	}

	render() {
		return (
			<div className="customer-inputs">
				<div className="fieldset customer-info">
					<div className="input-wrap full">
						<label className="input-rdo-label">Genre</label>
						<span className="input-rdo">
							<input name="gender" type="radio" id="gender_mrs" value="mrs" defaultChecked onChange={this.handleChangeGender} />
							<label htmlFor="gender_mrs">Madame</label>
						</span>
						<span className="input-rdo">
							<input name="gender" type="radio" id="gender_mr" value="mr" defaultChecked={ 'mr' === this.props.gender } onChange={this.handleChangeGender} />
							<label htmlFor="gender_mr">Monsieur</label>
						</span>
					</div>
					<div className="input-wrap half">
						<label htmlFor="firstname">Prénom</label>
						<input type="text" id="firstname" name="firstname" defaultValue={ this.props.firstname } placeholder={this.state.name_placeholder.first} autoComplete="off" />
					</div>
					<div className="input-wrap half">
						<label htmlFor="lastname">Nom</label>
						<input type="text" id="lastname" name="lastname" defaultValue={ this.props.lastname } placeholder={this.state.name_placeholder.last} autoComplete="off" />
					</div>
					<div className="input-wrap full">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" defaultValue={ this.props.email } placeholder={ `${this.state.name_placeholder.first}.${this.state.name_placeholder.last}@example.com`.toLowerCase() } autoComplete="off" />
					</div>
				</div>
			</div>
		);
	}
}
CustomerInputs.propTypes = {
	gender			: PropTypes.string,
	firstname		: PropTypes.string,
	lastname		: PropTypes.string,
	email				: PropTypes.string,
};
