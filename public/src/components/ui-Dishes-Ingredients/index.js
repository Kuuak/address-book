// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Preloader from 'components/ui-Preloader';
import Dishes from 'components/ui-Dishes';
import Ingredients from 'components/ui-Ingredients';

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
						<Dishes addAlerts={ this.props.addAlerts } />
					</div>
					<div className="column-ingredients">
						<Ingredients addAlerts={ this.props.addAlerts } />
					</div>
				</div>
			</div>
		);
	}
}
DishesIngredients.PropTypes = {
	addAlerts: PropTypes.func.isRequired,
}
