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
import Dish from 'components/ui-Dishes/dish';
import DishForm from 'components/ui-Dishes/form';

export default class Dishes extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading: true,
			dishes: [],
		};

		this.handleClick = this.handleClick.bind( this );
		this.handleSubmitSuccess = this.handleSubmitSuccess.bind( this );
	}

	componentDidMount() {
		this.fetch();
	}

	fetch() {
		this.setState({ loading	: true });

		fetch( '/dish/' )
			.then( res => res.json() )
			.then( res => {
				res.dishes.sort( (a, b) => a.name.localeCompare(b.name) );
				this.setState({
					loading	: false,
					dishes	: res.dishes
				});
			} );
	}

	handleClick( dish ) {
		if ( isFunction( this.props.onDishSelect  ) ) {
			this.props.onDishSelect( dish );
		}
	}

	handleSubmitSuccess( dish ) {
		if ( isFunction( this.props.onDishSelect  ) ) {
			this.props.onDishSelect( dish );
		}

		this.fetch();
	}

	render() {
		return (
			<ul className="dishes card collection with-header">
				<li className="collection-header"><h2>Plats</h2></li>
					{ this.state.dishes.map( (dish, i) => <Dish key={ dish._id } {...dish} onClick={ this.handleClick } /> ) }
				<li className="collection-footer">
					<DishForm onSubmitSuccess={ this.handleSubmitSuccess } addAlerts={ this.props.addAlerts } />
				</li>
			</ul>
		);
	}
}
Dishes.PropTypes = {
	onDishSelect: PropTypes.func,
	addAlerts		: PropTypes.func.isRequired,
};
