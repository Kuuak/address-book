// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import OrderItems from 'components/ui-OrderItems';

class Order extends React.Component {

	constructor( props ) {
		super( props );

		this.steps		= [ 'items', 'delivery', 'validation', 'confirmation' ];

		this.state = {
			step: 0,
			items: [],
			customer: {
				phone: this.props.phone,
				address: this.props.addrId,
			},
			location: this.props.location.pathname.replace( new RegExp( this.steps.join('|') + '/' ), '' ),
		};

		this.nextStep = this.nextStep.bind(this);

		this.addItem			= this.addItem.bind(this);
		this.copyItem			= this.copyItem.bind(this);
		this.removeItem		= this.removeItem.bind(this);
		this.addExtra			= this.addExtra.bind(this);
		this.removeExtra	= this.removeExtra.bind(this);
	}

	nextStep() {
		let nextStep = this.state.step + 1
		this.setState({ step: nextStep });
		this.props.history.push( this.state.location + this.steps[nextStep] +'/' )
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
			<div className={ `order step-${this.steps[this.state.step]}` }>
				<OrderItems
					active={ 0 == this.state.step }
					items={ this.state.items }
					addItem={ this.addItem }
					copyItem={ this.copyItem }
					removeItem={ this.removeItem }
					addExtra={ this.addExtra }
					removeExtra={ this.removeExtra }
					addAlerts={ this.props.addAlerts }
					location={ this.state.location }
					nextStep={ this.nextStep }
				/>
			<section className={'order-step step-items'+ ( 1 == this.state.step ? ' active' : '' ) }>
					<Link className="lateral" to={ `${this.state.location}delivery/` }>Livraison</Link>
					<div className="content">
						<h1>Livraison</h1>

					</div>
				</section>
				<section className={'order-step step-items'+ ( 2 == this.state.step ? ' active' : '' ) }>
					<Link className="lateral" to={ `${this.state.location}validation/` }>Validation</Link>
					<div className="content">
						<h1>Validation</h1>

					</div>
				</section>
				<section className={'order-step step-items'+ ( 3 == this.state.step ? ' active' : '' ) }>
					<Link className="lateral" to={ `${this.state.location}confirmation/` }>Confirmation</Link>
					<div className="content">
						<h1>Confirmation</h1>

					</div>
				</section>
			</div>
		);
	}
}
Order.PropTypes = {
	id				: PropTypes.number,
	phone			: PropTypes.string,
	addrId		: PropTypes.number,
	addAlerts	: PropTypes.func.isRequired,
};

export default Order
