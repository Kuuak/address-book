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
import Ingredient from 'components/ui-Ingredients/ingredient';
import IngredientForm from 'components/ui-Ingredients/form';

export default class Ingredients extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			loading			: false,
			ingredients	: [],
			current			: null,
			search			: null,
		};

		this.handleClick = this.handleClick.bind( this );
		this.handleClickClose = this.handleClickClose.bind( this );
		this.handleSubmitSuccess = this.handleSubmitSuccess.bind( this );
		this.handleFormNameChange = this.handleFormNameChange.bind( this );
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

		switch ( action ) {
			case 'add':
			case 'remove':
				if ( isFunction( this.props.onIngredientSelect  ) ) {
					this.props.onIngredientSelect( action, ingredient );
				}

				this.setState({
					current: {
						clear: true,
					},
					search: null,
				});
				break;
			case 'edit':
				this.setState({ current: this.state.ingredients.find( igt => igt._id == ingredient.id ) });
				break;
			case 'delete':
				this.deleteIngredient( ingredient.id );
		}
	}

	deleteIngredient( ingredientId ) {
		if ( window.confirm(`Êtes-vous sûr de vouloir supprimer ce supplément ?`) ) {
			fetch( `/ingredient/${ingredientId}/`, { method: 'DELETE'} )
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

	handleSubmitSuccess( ingredient, method ) {

		if ( 'PUT' == method ) {
			this.setState({ current: null });
		}

		this.fetch();
	}

	handleFormNameChange( value ) {
		this.setState({
			current: null,
			search: value.toLowerCase(),
		});
	}

	render() {
		return (
			<ul className="ingredients card collection with-header">
				<li className="collection-header">
					<h2>Suppléments</h2>
					<Route path="/checkout" render={ () => <i onClick={ this.handleClickClose } className="material-icons">clear</i> } />
				</li>
				{ this.state.ingredients
						.filter( ingredient => ( isEmpty(this.state.search) ? true : ingredient.name.toLowerCase().includes( this.state.search ) ) )
						.map( ingredient => <Ingredient key={ ingredient._id } { ...ingredient } onClick={ this.handleClick } /> )
				}
				<li className="collection-footer">
					<IngredientForm { ...this.state.current } onSubmitSuccess={ this.handleSubmitSuccess } onInputChange={ this.handleFormNameChange } addAlerts={ this.props.addAlerts } />
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
