// Assets depedencies (Style & images)
import './index.css';
import './print.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import Basket from 'components/ui-Checkout/basket';
import Delivery from 'components/ui-Checkout/delivery';
import Summary from 'components/ui-Checkout/summary';
import Complete from 'components/ui-Checkout/complete';

export default class Checkout extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			items: [],
			order: this.props.orderId,
			delivery: {
				customer: this.props.custId,
				address	: this.props.addrId,
			},
		};

		this.addItem			= this.addItem.bind(this);
		this.copyItem			= this.copyItem.bind(this);
		this.removeItem		= this.removeItem.bind(this);
		this.addExtra			= this.addExtra.bind(this);
		this.removeExtra	= this.removeExtra.bind(this);
	}

	componentDidMount() {
		this.props.history.replace( `/checkout/${this.props.step}/` ); // remove the queryString (search)
	}

	componentWillReceiveProps( nextProps ) {
		if ( ! isNaN(nextProps.addrId) && nextProps.addrId != this.state.delivery.address ) {
			this.setState({
				delivery: {
					customer: this.state.delivery.customer,
					address: nextProps.addrId
				}
			});
			this.props.history.replace( `/checkout/${nextProps.step}/` ); // remove the queryString (search)
		}
		if ( ! isNaN(nextProps.orderId) && nextProps.orderId != this.state.order ) {
			this.setState({
				order: nextProps.orderId
			});
			this.props.history.replace( `/checkout/${nextProps.step}/` ); // remove the queryString (search)
		}
	}

	addItem( dish ) {

		let newId			= ( this.state.items.length ? this.state.items[this.state.items.length-1].id + 1 : 1 ),
				newItems	= this.state.items;

		newItems.push( {
			id		: newId,
			dish	: dish.id,
			name	: dish.name,
			price	: dish.price,
			extras: [],
		} );

		this.setState({ items: newItems });

		return newId;
	}
	copyItem( itemId ) {

		let index		= this.state.items.findIndex( item => item.id == itemId ),
				newItemId	= this.addItem( this.state.items[ index ] );

		this.state.items[ index ].extras.forEach( extra => this.addExtra(newItemId, extra.type, { id: extra.ingredient, name: extra.name, price: extra.price } ) );
	}
	removeItem( itemId ) {

		let items = this.state.items,
				index = items.findIndex( item => item.id == itemId );

		if ( 0 <= index ) {
			items.splice( index, 1 );

			this.setState({ items: items });
		}
	}

	addExtra( itemId, type, ingredient ) {

		let items = this.state.items,
				index = items.findIndex( item => item.id == itemId );

		if ( 0 <= index ) {
			items[index].extras.push({
				id				: ( items[index].extras.length ? items[index].extras[items[index].extras.length-1].id + 1 : 1 ),
				type			: type,
				name			: ingredient.name,
				price			: ingredient.price,
				ingredient: ingredient.id,
			});

			this.setState({ items: items });
		}
	}
	removeExtra( itemId, extraId ) {
		let items = this.state.items,
				itemIndex = items.findIndex( item => item.id == itemId );

		if ( 0 <= itemIndex ) {
			let extraIndex = items[ itemIndex ].extras.findIndex( extra => extra.id == extraId );

			if ( 0 <= extraIndex ) {
				items[ itemIndex ].extras.splice( extraIndex, 1 );
				this.setState({ items: items });
			}
		}
	}

	render() {
		return (
			<div className="checkout">
				<Delivery active={ 'delivery' == this.props.step } { ...this.state.delivery } addAlerts={ this.props.addAlerts } history={ this.props.history } />
				<Basket active={ 'basket' == this.props.step } { ...this.state.delivery } items={ this.state.items } addItem={ this.addItem } copyItem={ this.copyItem } removeItem={ this.removeItem } addExtra={ this.addExtra } removeExtra={ this.removeExtra } addAlerts={ this.props.addAlerts } />
				<Summary active={ 'summary' == this.props.step } { ...this.state.delivery } items={ this.state.items } addAlerts={ this.props.addAlerts } history={ this.props.history } />
				<Complete active={ 'complete' == this.props.step } id={ this.state.order } addAlerts={ this.props.addAlerts } />
			</div>
		);
	}
}
Checkout.PropTypes = {
	step			: PropTypes.string.isRequired,
	custId		: PropTypes.number,
	addrId		: PropTypes.number,
	orderId		: PropTypes.number,
	addAlerts	: PropTypes.func.isRequired,
	history		: PropTypes.object.isRequired,
};
