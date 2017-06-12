// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Preloader from 'components/ui-Preloader';

// Helpers
import isEmpty from 'lodash.isempty';


export default class DishesIngredients extends React.Component {

	constructor( props ) {
		super(props);

		this.state = {
			loading: false,
		};
	}

	render() {
		return (
			<div className="dishes-ingredients content">
				<h1>Gestion des plats et suppléments</h1>
				<Preloader active={this.state.loading} />
				<div className="row">
					<div className="column-dishes">
					</div>
					<div className="column-ingredients">
					</div>
				</div>
			</div>
		);
	}
}
DishesIngredients.PropTypes = {
	addAlerts: PropTypes.func.isRequired,
}
