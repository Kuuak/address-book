// Assets depedencies (Style & images)$
import 'styles/collection.css';
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import isEmpty from 'lodash.isempty';
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
			current: null,
			search: null,
		};

		this.deleteDish = this.deleteDish.bind( this );
		this.handleClick = this.handleClick.bind( this );
		this.handleClickAction = this.handleClickAction.bind( this );
		this.handleSubmitSuccess = this.handleSubmitSuccess.bind( this );
		this.handleSearch = this.handleSearch.bind(this);
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

		this.setState({
			current: {
				clear: true,
			},
			search: null,
		});
	}

	handleClickAction( action, dishId ) {
		switch (action) {
			case 'edit':
				this.setState({ current: this.state.dishes.find( dish => dish._id == dishId ) });
				break;
			case 'delete':
				this.deleteDish( dishId );
				break;
		}
	}

	deleteDish( dishId ) {
		if ( window.confirm(`Êtes-vous sûr de vouloir supprimer ce plat ?`) ) {
			fetch( `/dish/${dishId}/`, { method: 'DELETE'} )
				.then( res => res.json() )
				.then( res => {
					if ( ! isEmpty(res.alerts) ) {
						this.props.addAlerts( res.alerts );
					}

					if ( res.success ) {
						this.fetch();
					}
				} );
		}
	}

	handleSubmitSuccess( dish, method ) {
		if ( !isEmpty(dish) && isFunction( this.props.onDishSelect ) ) {
			this.props.onDishSelect( dish );
		}

		if ( 'PUT' == method ) {
			this.setState({ current: null });
		}

		this.fetch();
	}

	handleSearch( query ) {
		this.setState({
			current: null,
			search: query.toLowerCase()
		});
	}

	render() {
		return (
			<ul className="dishes card collection with-header">
				<li className="collection-header"><h2>Plats</h2></li>
					{ this.state.dishes.filter( dish => (isEmpty(this.state.search) ? true : dish.name.toLowerCase().includes( this.state.search )) ).map( (dish, i) => <Dish key={ dish._id } {...dish} onClick={ this.handleClick } onClickAction={ this.handleClickAction }/> ) }
				<li className="collection-footer">
					<DishForm { ...this.state.current } onSubmitSuccess={ this.handleSubmitSuccess } onInputChange={ this.handleSearch } addAlerts={ this.props.addAlerts } />
				</li>
			</ul>
		);
	}
}
Dishes.PropTypes = {
	onDishSelect: PropTypes.func,
	addAlerts		: PropTypes.func.isRequired,
};
