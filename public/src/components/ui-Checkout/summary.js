// Assets depedencies (Style & images)
import 'styles/collection.css';
import './summary.css';

// APP settings
import config from '../../../../config';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import calcItemsTotal from 'includes/calcItemsTotal';

// Components
import Gmap from 'components/ui-Gmap';
import Customer from 'components/ui-Customer/card';
import { Item } from 'components/ui-Checkout/basket';

export default class CheckoutSummary extends React.Component {

	constructor( props ) {
		super( props );

		this.state = { payment: 'cash' };

		this.handleConfirmation = this.handleConfirmation.bind( this );
		this.handleChangePayment = this.handleChangePayment.bind( this );
		this.handleChangeDiscount = this.handleChangeDiscount.bind( this );
	}

	handleChangePayment( event ) {
		this.setState({ payment: event.target.value });
	}

	handleChangeDiscount( event ) {
		this.props.updateDiscount( parseInt(event.target.value) );
	}

	handleConfirmation( event ) {
		event.preventDefault();

		fetch( `/order/`, {
			body: JSON.stringify({
				items				: this.props.items,
				address			: this.props.address,
				customer		: this.props.customer,
				payment			: this.state.payment,
				discount		: this.props.discount,
				information	: this.information.value,
			}),
			method: 'POST',
			headers: new Headers({
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}),
		})
			.then( res => res.json() )
			.then( res => {

				if ( res.alerts ) {
					this.props.addAlerts( res.alerts );
				}

				if ( res.success ) {
					this.props.history.push( `/checkout/complete/?order=${res.order._id}` );
				}
			} );
	}

	render() {

		const totals = calcItemsTotal( this.props.items, this.props.discount );

		return (
			<section className={'checkout-step step-summary '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Récapitulatif</div>
				<div className="content">
					<h1>Récapitulatif</h1>
					<div className="row">
						<div className="column-customer">
							<Customer
								id={ this.props.customer }
								addrId={ this.props.address }
								location={ '' }
								addAlerts={ this.props.addAlerts }
							/>
							<div className="gmap card">
								{ this.props.active && <Gmap custId={ this.props.customer } addrId={ this.props.address } addAlerts={ this.props.addAlerts } /> }
							</div>
						</div>
						<div className="column-basket">
							<ul className="selected-items card collection with-header">
								<li className="item collection-header"><h2>Panier</h2></li>
								{ this.props.items.map( item => <Item key={ item.id } { ...item } /> ) }
								<li className="collection-footer">
									{ 0 < this.props.discount && (
										<div className="discount-wrap">
											<div className="subtotal">
												<h4>Sous-total</h4>
												<h4 className="secondary-content black-text">{ totals.subtotal.toFixed(2) }</h4>
											</div>
											<div className="discount">
												<h4>Réduction { this.props.discount }%</h4>
												<h4 className="secondary-content black-text">- { totals.discount.toFixed(2) }</h4>
											</div>
										</div>
									) }
									<div className="total">
										<h3>Total</h3>
										<h3 className="secondary-content black-text">{ totals.total.toFixed(2) }</h3>
									</div>
								</li>
							</ul>
							<div className="order-information collection with-header card">
								<div className="item collection-header"><h2>Commande</h2></div>
								<div className="collection-item">
									<div className="input-wrap order-discount">
										<label className="input-label">Réduction (en %)</label>
										<input type="number" id="order_discount" name="discount" value={ this.props.discount } min={ config.discount.min } max={ config.discount.max } step={ config.discount.step } onChange={ this.handleChangeDiscount } />
									</div>
									<div className="input-wrap order-payment-method">
										<label className="input-rdo-label">Moyen de paymement</label>
										<div className="input-rdo">
											<input type="radio" id="payment_cash" name="payment" value='cash' defaultChecked={ true } onChange={ this.handleChangePayment } />
											<label htmlFor="payment_cash">En liquide</label>
										</div>
										<div className="input-rdo">
											<input type="radio" id="payment_card" name="payment" value='card' defaultChecked={ false } onChange={ this.handleChangePayment } />
											<label htmlFor="payment_card">Par carte</label>
										</div>
									</div>
									<div className="input-wrap order-extra-info">
										<label htmlFor="order_information" >Information supplémentaire</label>
										<textarea id="order_information" className="materialize-textarea" ref={ textarea => this.information = textarea }></textarea>
									</div>
								</div>
							</div>
							<div className="checkout-process-action">
								<Link to="/checkout/basket/" className="btn red lighten-2 checkout-return">Retour</Link>
								<Link to="/checkout/complete/" onClick={ this.handleConfirmation } className="btn red checkout-next">Confirmer</Link>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
CheckoutSummary.PropTypes = {
	items					: PropTypes.array.isRequired,
	active				: PropTypes.bool,
	customer			: PropTypes.number.isRequired,
	address				: PropTypes.number.isRequired,
	addAlerts			: PropTypes.func.isRequired,
	updateDiscount: PropTypes.func.isRequired,
};
CheckoutSummary.defaultProps = {
	items	: [],
	active: false,
};
