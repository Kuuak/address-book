// Assets depedencies (Style & images)
import 'styles/fade.css';
import './basket.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Dishes from 'components/ui-Dishes';

/**
 * Calculate total price of given items including extras
 *
 * @since TODO 1.0.0
 *
 * @param		array		items		Items to calculate total price
 * @return	number					Total price
 */
export function calcItemsTotal( items ) {
	let totalPrice = 0;

	items.forEach( item => {
		let itemPrice = item.price;

		item.extras.forEach( extra => {
			if ( 'add' == extra.type ) { itemPrice += extra.price; }
			else { itemPrice -= extra.price; }
		} );

		totalPrice += itemPrice;
	} );

	return totalPrice;
}

export default class CheckoutBasket extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			ingredients: [],
			selectedItem: null,
		};

		this.addExtra = this.addExtra.bind( this );
		this.addIngredient = this.addIngredient.bind( this );
		this.toggleIngredients = this.toggleIngredients.bind( this );
		this.handleNextStep = this.handleNextStep.bind( this );
		this.handleClickItem = this.handleClickItem.bind( this );
	}

	componentDidMount() {
		fetch( '/ingredient/' )
			.then( res => res.json() )
			.then( res => {
				res.ingredients.sort( (a, b) => a.name.localeCompare(b.name) );
				this.setState({ ingredients: res.ingredients });
			} );
	}

	handleClickItem( action, itemId, extraId ) {
		switch (action) {
			case 'copy':
				this.props.copyItem( itemId );
				break;
			case 'extra':
				this.toggleIngredients( itemId );
				break;
			case 'delete':
				this.props.removeItem( itemId );
				break;
			case 'extra-delete':
				this.props.removeExtra( itemId, extraId );
				break;
		}
	}

	toggleIngredients( itemId ) {
		this.setState({ selectedItem: ( typeof itemId == 'object' ? null : ( itemId == this.state.selectedItem ? null : itemId ) ) });
	}

	addIngredient( ingredient ) {
		let ingredients = this.state.ingredients;
		ingredients.push( ingredient );
		this.setState({ ingredients: ingredients });
	}
	addExtra( type, ingredient ) {
		if ( ! isNull(this.state.selectedItem) ) {
			this.props.addExtra( this.state.selectedItem, type, ingredient );
		}
	}

	handleNextStep( event ) {
		this.toggleIngredients( this.state.selectedItem );
		// if ( isEmpty(this.props.items) ) {
		// 	event.preventDefault();
		// 	this.props.addAlerts({
		// 		icon		: 'error',
		// 		status	: 'error',
		// 		title		: 'Oups',
		// 		message	: 'Merci d\'ajouter au moins un plat dans le panier.',
		// 	});
	}

	render() {
		return (
			<section className={'checkout-step step-items '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Commande</div>
				<div className="content">
					<h1>Commande</h1>
					<div className="row">
						<div className="column-left">
							<ul className={ 'ingredients collection with-header'+ ( this.state.selectedItem ? ' active' : '' ) }>
								<li className="collection-header">
									<h2>Suppléments</h2>
									<i onClick={ this.toggleIngredients } className="material-icons">clear</i>
								</li>
								{ this.state.ingredients.map( ingredient => <Ingredient key={ ingredient._id } { ...ingredient } addExtra={ this.addExtra } /> ) }
								<li className="collection-footer">
									<IngredientForm addIngredient={ this.addIngredient } addExtra={ this.addExtra } addAlerts={ this.props.addAlerts } />
								</li>
							</ul>
							<Dishes onDishSelect={ this.props.addItem } addAlerts={ this.props.addAlerts } />
						</div>
						<div className="column-right">
							<CSSTransitionGroup component="ul" className="selected-items card collection with-header" transitionName={{ enter: 'add', leave: 'delete' }} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
								<li key="header" className="item collection-header"><h2>Panier</h2></li>
								{ this.props.items.map( item => <Item key={ item.id } selected={ item.id == this.state.selectedItem } { ...item } onClick={ this.handleClickItem } /> ) }
								<li key="footer" className="collection-footer">
									<h3>Total</h3>
									<h3 className="secondary-content black-text">{ calcItemsTotal( this.props.items ).toFixed(2) }</h3>
								</li>
							</CSSTransitionGroup>
							<div className="checkout-process-action">
								<Link to="/checkout/delivery/" className="btn red lighten-2 checkout-return">Retour</Link>
								<Link to="/checkout/summary/" onClick={ this.handleNextStep } className="btn red checkout-next">Suivant</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
CheckoutBasket.defaultProps = {
	items: [],
	active: false,
};
CheckoutBasket.PropTypes = {
	items				: PropTypes.array,
	active			: PropTypes.bool,
	addItem			: PropTypes.func.isRequired,
	copyItem		: PropTypes.func.isRequired,
	removeItem	: PropTypes.func.isRequired,
	addExtra		: PropTypes.func.isRequired,
	removeExtra	: PropTypes.func.isRequired,
	addAlerts		: PropTypes.func.isRequired,
	customer		: PropTypes.number.isRequired,
	address			: PropTypes.number.isRequired,
};

export class Item extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick			= this.handleClick.bind( this );
		this.handleExtraClick	= this.handleExtraClick.bind( this );
	}

	handleClick( event ) {
		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( event.target.rel, this.props.id );
		}
	}
	handleExtraClick( action, extraId ) {
		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( `extra-${action}`, this.props.id, extraId );
		}
	}

	render() {
		return (
			<li className={ 'item collection-item'+ ( this.props.selected ? ' selected' : '' ) } >
				<div className="item-detail">
					<Route path="/checkout/basket" render={ () => (
						<span className="collection-item-action">
							<a onClick={ this.handleClick } rel="delete" className="delete material-icons" title="Supprimer">delete</a>
							<a onClick={ this.handleClick } rel="copy" className="copy material-icons" title="Copier">add_box</a>
							<a onClick={ this.handleClick } rel="extra" className="extra material-icons" title="Suppléments">exposure</a>
						</span>
					)} />
					<span className="item-name">{this.props.name}</span>
					<span className="item-price secondary-content black-text">{this.props.price.toFixed(2)}</span>
				</div>
				<div>
					<ul className="item-extra">
						{ this.props.extras && this.props.extras.map( extra => <Extra key={ extra.id } { ...extra } onClick={ this.handleExtraClick } /> ) }
					</ul>
				</div>
			</li>
		);
	}
}
Item.defaultProps = {
	extras: [],
	selected: false,
};
Item.PropTypes = {
	id			: PropTypes.number.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	extras	: PropTypes.array,
	selected: PropTypes.bool,
	onClick	: PropTypes.func,
};

export class Ingredient extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( event ) {
		this.props.addExtra( event.target.rel, {
			id		: this.props._id,
			name	: this.props.name,
			price	: this.props.price,
		});
	}

	render() {
		return (
			<li className="ingredient collection-item">
				<span className="collection-item-action">
					<a onClick={ this.handleClick } rel="add" className="extra material-icons" title="Supplément">add_circle_outline</a>
					<a onClick={ this.handleClick } rel="remove" className="delete material-icons" title="Sans">remove_circle_outline</a>
				</span>
				{ this.props.name }
				{ this.props.price && <span className="secondary-content black-text">{ this.props.price.toFixed(2) }</span> }
			</li>
		);
	}
}
Ingredient.PropTypes = {
	_id			: PropTypes.number.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	addExtra: PropTypes.func.isRequired,
};

export class IngredientForm extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			name: '',
			price: ''
		};

		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleChangeName = this.handleChangeName.bind( this );
		this.handleChangePrice = this.handleChangePrice.bind( this );
	}

	handleSubmit( event ) {
		event.preventDefault();

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		fetch( form.action, {
			method: 'POST',
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


			if ( res.success ) {
				this.props.addIngredient( res.ingredient );
				this.setState({
					name: '',
					price: '',
				});
				form.elements[0].focus();
			}

		} );
	}
	handleChangeName( event ) {
		this.setState({ name: event.target.value });
	}
	handleChangePrice( event ) {

		let newPrice = event.target.value.replace( /\D/, '' );

		if ( 2 < newPrice.length ) {
			let decimal = newPrice.slice(-2);
			newPrice = newPrice.slice( 0, newPrice.length-decimal.length ) +'.'+ decimal;
		}

		this.setState({ price: newPrice });
	}

	render() {
		return (
			<form method="POST" action="/ingredient/" className="add-ingredient-form" onSubmit={ this.handleSubmit }>
				<input type="text" name="name" className="name" placeholder="Ajouter un supplément" value={ this.state.name } onChange={ this.handleChangeName } autoComplete="off" required />
				<input type="text" name="price" className="price" placeholder="Prix" value={ this.state.price } pattern="\d+(\.\d{1,2})?" onChange={ this.handleChangePrice } autoComplete="off" />
				<button type="submit" className="btn blue">Ajouter</button>
			</form>
		);
	}
}
IngredientForm.PropTypes = {
	addExtra			: PropTypes.func.isRequired,
	addIngredient	: PropTypes.func.isRequired,
};

export class Extra extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		if ( isFunction(this.props.onClick) ) {
			this.props.onClick( 'delete', this.props.id );
		}
	}

	render() {
		return (
			<li className="extra">
				<a onClick={ this.handleClick } rel="delete" title="Supprimer">
					<strong className={ 'add' == this.props.type ? 'green-text' : 'red-text' }>{ 'add' == this.props.type ? '+' : '-' }</strong>
					<span className="extra-name">{this.props.name}</span>
					{ this.props.price && <span className="extra-price secondary-content black-text">{ ('add' == this.props.type ? '+' : '-' ) + this.props.price.toFixed(2) }</span> }
				</a>
			</li>
		);
	}
}
Extra.PropTypes = {
	id			: PropTypes.number.isRequired,
	type		: PropTypes.string.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	onClick	: PropTypes.func,
};
