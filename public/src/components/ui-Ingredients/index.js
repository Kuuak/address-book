// Assets depedencies (Style & images)$
import 'styles/collection.css';
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import isFunction from 'lodash.isfunction';

// Components
import Ingredient from 'components/ui-Ingredients/ingredient';
import IngredientForm from 'components/ui-Ingredients/form';

export default class Ingredients extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: false,
			ingredients: [],
		};


		this.handleClick = this.handleClick.bind( this );
		this.handleClickClose = this.handleClickClose.bind( this );
		this.handleSubmitSuccess = this.handleSubmitSuccess.bind( this );
	}

	componentDidMount() {
		this.fetch();
	}

	fetch() {
		this.setState({ loading	: true });

		fetch( '/ingredient/' )
			.then( res => res.json() )
			.then( res => {
				res.ingredients.sort( (a, b) => a.name.localeCompare(b.name) );
				this.setState({
					loading	: false,
					ingredients	: res.ingredients
				});
			} );
	}

	handleClickClose( event ) {
		event.preventDefault();

		if ( isFunction( this.props.onClose ) ) {
			this.props.onClose();
		}
	}

	handleClick( action, ingredient ) {
		if ( isFunction( this.props.onIngredientSelect  ) ) {
			this.props.onIngredientSelect( action, ingredient );
		}
	}

	handleSubmitSuccess( dish ) {
		this.fetch();
	}

	render() {
		return (
			<ul className="ingredients card collection with-header">
				<li className="collection-header">
					<h2>Suppléments</h2>
					<i onClick={ this.handleClickClose } className="material-icons">clear</i>
				</li>
				{ this.state.ingredients.map( ingredient => <Ingredient key={ ingredient._id } { ...ingredient } onClick={ this.handleClick } /> ) }
				<li className="collection-footer">
					<IngredientForm onSubmitSuccess={ this.handleSubmitSuccess } addAlerts={ this.props.addAlerts } />
				</li>
			</ul>
		);
	}
}
Ingredients.PropTypes = {
	onClose						: PropTypes.func,
	onIngredientSelect: PropTypes.func,
	addAlerts					: PropTypes.func.isRequired,
};
