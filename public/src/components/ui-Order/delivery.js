// Assets depedencies (Style & images)
import './delivery.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import Gmap from 'components/ui-Gmap';
import Customer from 'components/ui-Customer/card';
import AddressForm from 'components/ui-CustomerForm/address';
import CustomerForm from 'components/ui-CustomerForm/details';

export default class OrderDelivery extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			editCustomer: false,
			addAddress: false,
		};

		this.handleClick = this.handleClick.bind( this );
		this.handleChange = this.handleChange.bind( this );
		this.handleNextStep = this.handleNextStep.bind( this );
		this.onFormsSuccess = this.onFormsSuccess.bind( this );
	}

	handleNextStep( event ) {
		if ( isNaN(this.props.customer) || isNaN(this.props.address) ) {
			event.preventDefault();
			this.props.addAlerts({
				icon		: 'error',
				status	: 'error',
				title		: 'Oups',
				message	: 'Veuillez sélectionner un client et une adresse de livraison.',
			});
		}
	}

	handleClick( event ) {
		event.preventDefault();
		switch ( event.target.rel ) {
			case 'edit':
				this.setState({ editCustomer: true });
				break;

			case 'add':
				this.setState({ addAddress: true });
				break;

			case 'close-aside':
				this.setState({
					editCustomer: false,
					addAddress: false,
				});
				break;
		}
	}

	onFormsSuccess() {
		this.setState({
			editCustomer: false,
			addAddress: false,
		});
		this.customer.getCustomer();
	}

	handleChange( event, custId, addrId ) {
		this.props.history.push( `/order/delivery/?address=${addrId}` );
	}

	render() {
		return (
			<section className={'order-step step-delivery '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Livraison</div>
				<div className="content">
					<h1>Livraison</h1>
					<div className="row">
						<div className="column-customer">
							<Customer
								id={ this.props.customer }
								addrId={ this.props.address }
								location={ '' }
								addAlerts={ this.props.addAlerts }
								onChange={ this.handleChange }
								onClick={ this.handleClick }
								ref={ customer => this.customer = customer }
							/>
						</div>
						<div className="column-gmap card">
							{ this.props.active && <Gmap custId={ this.props.customer } addrId={ this.props.address } addAlerts={ this.props.addAlerts } /> }
						</div>
						<div className="order-process-action">
							<Link to="/" className="btn grey lighten-1 order-cancel">Annuler</Link>
							<Link to="/order/basket/" onClick={ this.handleNextStep } className="btn red order-next">Suivant</Link>
						</div>
					</div>
				</div>
				<aside className={( this.state.editCustomer || this.state.addAddress ? 'open' : '' )} >
					<Link to={ `/order/customer/${this.props.customer}/address/${this.props.address}/delivery/` } rel="close-aside" className="material-icons close" onClick={ this.handleClick }>clear</Link>
					{ ( this.state.editCustomer && <CustomerForm key="customerForm" id={ this.props.customer } addAlerts={ this.props.addAlerts } onSubmitSucess={ this.onFormsSuccess } /> ) }
					{ ( this.state.addAddress && <AddressForm key="addressForm" custId={ this.props.customer } addAlerts={ this.props.addAlerts } onSubmitSucess={ this.onFormsSuccess } /> ) }
				</aside>
			</section>
		);
	}
}
OrderDelivery.defaultProps = {
	active: false,
};
OrderDelivery.PropTypes = {
	active				: PropTypes.bool,
	customer			: PropTypes.number.isRequired,
	address				: PropTypes.number.isRequired,
	addAlerts			: PropTypes.func.isRequired,
	history				: PropTypes.object.isRequired,
};
