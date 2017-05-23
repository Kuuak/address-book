// Assets depedencies (Style & images)
import 'styles/fade.css';
import './index.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

class OrderItems extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			dishes: [],
			ingredients: [],
			selectedItem: null,
		};

		this.addDish = this.addDish.bind( this );
		this.addExtra = this.addExtra.bind( this );
		this.addIngredient = this.addIngredient.bind( this );
		this.toggleIngredients = this.toggleIngredients.bind( this );
		this.handleNextStep = this.handleNextStep.bind( this );
	}

	componentDidMount() {
		fetch( '/dish/' )
			.then( res => res.json() )
			.then( res => {
				res.dishes.sort( (a, b) => a.name.localeCompare(b.name) );
				this.setState({ dishes: res.dishes });
			} );

		fetch( '/ingredient/' )
			.then( res => res.json() )
			.then( res => {
				res.ingredients.sort( (a, b) => a.name.localeCompare(b.name) );
				this.setState({ ingredients: res.ingredients });
			} );
	}

	toggleIngredients( itemId ) {
		this.setState({ selectedItem: (typeof itemId == 'object' ? null : itemId) });
	}

	addDish( dish ) {
		let dishes = this.state.dishes;
		dishes.push( dish );
		this.setState({ dishes: dishes });
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
		event.preventDefault();
		if ( isEmpty(this.props.items) ) {
			this.props.addAlerts({
				icon		: 'error',
				status	: 'error',
				title		: 'Oups',
				message	: 'Merci d\'ajouter au moins un plat dans le panier.',
			});
		}
		else {
			this.props.nextStep();
		}

	}

	calcTotal() {
		let totalPrice = 0;

		this.props.items.forEach( item => {
			let itemPrice = item.price;

			item.extras.forEach( extra => {
				if ( 'add' == extra.type ) { itemPrice += extra.price; }
				else { itemPrice -= extra.price; }
			} );

			totalPrice += itemPrice;
		} );

		return totalPrice.toFixed(2);
	}

	render() {
		return (
			<section className={'order-step step-items '+ ( this.props.active && 'active' ) }>
				<Link className="lateral" to={ `${this.props.location}items/` } >Commande</Link>
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
							<ul className="dishes card collection with-header">
							<li className="collection-header"><h2>Plats</h2></li>
							{ this.state.dishes.map( (dish, i) => <Dish key={ dish._id } {...dish} addItem={ this.props.addItem } /> ) }
							<li className="collection-footer">
								<DishForm addDish={ this.addDish } addItem={ this.props.addItem } addAlerts={ this.props.addAlerts } />
							</li>
						</ul>
						</div>
						<div className="column-right">
							<CSSTransitionGroup component="ul" className="selected-items card collection with-header" transitionName={{ enter: 'add', leave: 'delete' }} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
								<li key="header" className="item collection-header"><h2>Panier</h2></li>
								{ this.props.items.map( item => <Item key={ item.id } selected={ item.id == this.state.selectedItem } { ...item } copy={ this.props.copyItem } remove={ this.props.removeItem } openIngredients={ this.toggleIngredients } removeExtra={ this.props.removeExtra } /> ) }
								<li key="footer" className="collection-footer">
									<h3>Total</h3>
									<h3 className="secondary-content black-text">{ this.calcTotal() }</h3>
								</li>
							</CSSTransitionGroup>
							<div className="order-process-action">
								<Link to='/' className="btn grey lighten-1 order-cancel">Annuler</Link>
								<Link to={ `${this.props.location}delivery/` } onClick={ this.handleNextStep } className="btn red order-next">Suivant</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
OrderItems.defaultProps = {
	items: [],
	active: false,
};
OrderItems.PropTypes = {
	items				: PropTypes.array,
	active			: PropTypes.bool,
	addItem			: PropTypes.func.isRequired,
	copyItem		: PropTypes.func.isRequired,
	removeItem	: PropTypes.func.isRequired,
	addExtra		: PropTypes.func.isRequired,
	removeExtra	: PropTypes.func.isRequired,
	addAlerts		: PropTypes.func.isRequired,
};

class Dish extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( event ) {
		event.preventDefault();

		this.props.addItem({
			id		: this.props._id,
			name	: this.props.name,
			price	: this.props.price,
			desc	: this.props.desc,
		});
	}

	render() {
		return (
			<li className="dish collection-item">
				<Link to={`/dish/${this.props._id}/`} onClick={ this.handleClick } >
					{ this.props.name }
					<span className="secondary-content black-text">{ this.props.price.toFixed(2) }</span>
				</Link>
			</li>
		);
	}
}
Dish.PropTypes = {
	_id			: PropTypes.number.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	desc		: PropTypes.string,
	addItem	: PropTypes.func.isRequired,
};

class DishForm extends React.Component {

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
				this.props.addDish( res.dish );
				this.props.addItem({
					id		: res.dish._id,
					name	: res.dish.name,
					price	: res.dish.price,
					desc	: res.dish.desc,
				});

				this.setState({
					name: '',
					price: '',
				})
			}

		} );
	}
	handleChangeName( event ) {
		this.setState({ name: event.target.value });
	}
	handleChangePrice( event ) {

		let newPrice = event.target.value.replace( /\.|,/, '' );

		if ( 2 < newPrice.length ) {
			let decimal = newPrice.slice(-2);
			newPrice = newPrice.slice( 0, newPrice.length-decimal.length ) +'.'+ decimal;
		}

		this.setState({ price: newPrice });
	}

	render() {
		return (
			<form method="POST" action="/dish/" className="add-dish-form" onSubmit={ this.handleSubmit }>
				<input type="text" name="name" className="name" placeholder="Ajouter un plat" value={ this.state.name } onChange={ this.handleChangeName } autoComplete="off" />
				<input type="text" name="price" className="price" placeholder="Prix" value={ this.state.price } pattern="\d+(\.\d{1,2})?" onChange={ this.handleChangePrice } autoComplete="off" />
				<button type="submit" className="btn blue">Ajouter</button>
			</form>
		);
	}
}
DishForm.PropTypes = {
	addDish: PropTypes.func.isRequired,
	addItem: PropTypes.func.isRequired,
};

class Item extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClickCopy				= this.handleClickCopy.bind( this );
		this.handleClickRemove			= this.handleClickRemove.bind( this );
		this.handleClickOpenExtra		= this.handleClickOpenExtra.bind( this );
		this.handleClickRemoveExtra	= this.handleClickRemoveExtra.bind( this );
	}

	handleClickCopy() {
		this.props.copy( this.props.id );
	}
	handleClickRemove() {
		this.props.remove( this.props.id );
	}
	handleClickOpenExtra() {
		this.props.openIngredients( this.props.id );
	}
	handleClickRemoveExtra() {
		this.props.removeExtra( this.props.id );
	}

	render() {
		return (
			<li className={ 'item collection-item'+ ( this.props.selected ? ' selected' : '' ) } >
				<div className="item-detail">
					<span className="collection-item-action">
						<a onClick={ this.handleClickRemove } className="delete material-icons" title="Supprimer">delete</a>
						<a onClick={ this.handleClickCopy } className="copy material-icons" title="Copier">add_box</a>
						<a onClick={ this.handleClickOpenExtra } className="extra material-icons" title="Suppléments">exposure</a>
					</span>
					<span className="item-name">{this.props.name}</span>
					<span className="item-price secondary-content black-text">{this.props.price.toFixed(2)}</span>
				</div>
				<div>
					<ul className="item-extra">
						{ this.props.extras && this.props.extras.map( extra => <Extra key={ extra.id } { ...extra } itemId={ this.props.id } remove={ this.props.removeExtra } /> ) }
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
	id							: PropTypes.number.isRequired,
	name						: PropTypes.string.isRequired,
	price						: PropTypes.number.isRequired,
	extras					: PropTypes.array,
	selected				: PropTypes.bool,
	copy						: PropTypes.func.isRequired,
	remove					: PropTypes.func.isRequired,
	removeExtra			: PropTypes.func.isRequired,
	openIngredients	: PropTypes.func.isRequired,
};

class Ingredient extends React.Component {

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

class IngredientForm extends React.Component {

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
				})
			}

		} );
	}
	handleChangeName( event ) {
		this.setState({ name: event.target.value });
	}
	handleChangePrice( event ) {

		let newPrice = event.target.value.replace( /\.|,/, '' );

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

class Extra extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick() {
		this.props.remove( this.props.itemId, this.props.id )
	}

	render() {
		return (
			<li className="extra">
				<a onClick={ this.handleClick } title="Supprimer">
					<strong className={ 'add' == this.props.type ? 'green-text' : 'red-text' }>{ 'add' == this.props.type ? '+' : '-' }</strong>
					<span className="extra-name">{this.props.name}</span>
					{ this.props.price && <span className="extra-price secondary-content black-text">{ ('add' == this.props.type ? '+' : '-' ) + this.props.price.toFixed(2) }</span> }
				</a>
			</li>
		);
	}
}
IngredientForm.PropTypes = {
	id		: PropTypes.number.isRequired,
	type	: PropTypes.string.isRequired,
	name	: PropTypes.string.isRequired,
	price	: PropTypes.number.isRequired,
	itemId: PropTypes.number.isRequired,
	remove: PropTypes.func.isRequired,
};

export default OrderItems;