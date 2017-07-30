// Assets depedencies (Style & images)
import 'styles/fade.css';
import 'styles/collection.css';
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
import calcItemsTotal from 'includes/calcItemsTotal';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';

// Components
import Dishes from 'components/ui-Dishes';
import Ingredients from 'components/ui-Ingredients';

export default class CheckoutBasket extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectedItem: null,
		};

		this.addExtra = this.addExtra.bind( this );
		this.toggleIngredients = this.toggleIngredients.bind( this );
		this.handleNextStep = this.handleNextStep.bind( this );
		this.handleClickItem = this.handleClickItem.bind( this );
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

		const { total } = calcItemsTotal( this.props.items );

		return (
			<section className={'checkout-step step-items '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Commande</div>
				<div className="content">
					<h1>Commande</h1>
					<div className="row">
						<div className={'column-left'+ ( this.state.selectedItem ? ' show-ingredients' : '' ) }>
							<Ingredients onIngredientSelect={ this.addExtra } onClose={ this.toggleIngredients } addAlerts={ this.props.addAlerts } />
							<Dishes onDishSelect={ this.props.addItem } addAlerts={ this.props.addAlerts } />
						</div>
						<div className="column-right">
							<CSSTransitionGroup component="ul" className="selected-items card collection with-header" transitionName={{ enter: 'add', leave: 'delete' }} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
								<li key="header" className="item collection-header"><h2>Panier</h2></li>
								{ this.props.items.map( item => <Item key={ item.id } selected={ item.id == this.state.selectedItem } { ...item } onClick={ this.handleClickItem } /> ) }
								<li key="footer" className="collection-footer">
									<h3>Total</h3>
									<h3 className="secondary-content black-text">{ total.toFixed(2) }</h3>
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
