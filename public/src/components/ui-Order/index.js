// Assets depedencies (Style & images)
import 'styles/collection.css';
import './index.css';
import './print.css';
import imgLogo from 'images/_logo-black.jpg';

import config from '../../../../config';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import Gmap from 'components/ui-Gmap';
import { Item } from 'components/ui-Checkout/basket';

// Helpers
import isEmpty from 'lodash.isempty';
import QRCode from 'qrcode';
import formatDate from 'includes/formatDate';
import formatPhone from 'includes/formatPhone';
import calcItemsTotal from 'includes/calcItemsTotal';


export default class Order extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			_id					: 0,
			customer		: {
				_id: 0,
				gender: 'mrs',
				firstname: '',
				lastname: '',
				phone: '',
			},
			address			: {},
			items				: [],
			payment			: 'cash',
			date				: '',
			information	: '',
		};
	}

	componentDidMount() {
		fetch( `/order/${this.props.id}/`, { headers: new Headers({ 'Accept': 'application/json' }) } )
			.then( res => res.json() )
			.then( res => {
				if ( res.alerts ) {
					this.props.addAlerts( res.alerts );
				}

				if ( res.success ) {

					this.setState( res.order );

					let startAddr = encodeURIComponent( `${config.address.street} ${config.address.number}, ${config.address.postcode} ${config.address.city}, ${config.address.country}` ).replace( /%20/g, '+' );
					let destAddr = encodeURIComponent( `${res.order.address.street} ${res.order.address.number}, ${res.order.address.postcode} ${res.order.address.city} Suisse` ).replace( /%20/g, '+' );

					QRCode.toCanvas( `http://maps.google.com/?saddr=${startAddr}&daddr=${destAddr}` , (err, canvas) => {
						document.getElementById( 'qrcode' ).appendChild( canvas );
					} );
				}
			} );
	}

	render() {
		const totals	= calcItemsTotal( this.state.items ),
				tax 			= (totals.total/100) * config.tax;

		return (
			<div className="order card">
				<div className="order-header">
					<div className="logo">
						<img src={ imgLogo } alt="L'Escale Gourmande"/>
					</div>
					<address>
						<strong className="title">{ config.name }</strong>
						<div className="phone">Tél. { formatPhone( config.phone ) }</div>
						<div className="street">{ `${config.address.street} ${config.address.number}` }</div>
						<div className="city">{ `${config.address.postcode} ${config.address.city}` }</div>
					</address>
				</div>
				<div className="order-content">
					<div className="order-info">
						<div className="column">
							<div className="order-details">
								<div className="number"><strong>Commande n° : </strong>{ this.state._id.toLocaleString("arab",{minimumIntegerDigits:4, useGrouping: false}) }</div>
								<div className="date"><strong>Date : </strong>{ formatDate( this.state.date ) }</div>
								<div className="payment"><strong>Payement : </strong>{ 'card' == this.state.payment ? 'par carte' : 'en espèces' }</div>
								<div className="information"><strong>Informations : </strong>{ isEmpty(this.state.information) ? '-' : this.state.information }</div>
							</div>
							<div className="order-customer">
								<div className="column-left">
									<div className="name">{ `${this.state.customer.firstname} ${this.state.customer.lastname}` }</div>
									<div className="phone">{ formatPhone(this.state.customer.phone) }</div>
									<div><span className="street">{this.state.address.street}</span>&nbsp;<span className="number">{this.state.address.number}</span></div>
									<div><span className="postcode">{this.state.address.postcode}</span>&nbsp;<span className="city">{this.state.address.city}</span></div>
								</div>
								<div className="column-right">
									<div className="doorcode"><strong>Code de porte : </strong>{ isEmpty(this.state.address.doorcode) ? '-' : this.state.address.doorcode }</div>
									<div className="floor"><strong>Étage : </strong>{ isEmpty(this.state.address.floor) ? '-' : this.state.address.floor }</div>
									<div className="notes"><strong>Informations : </strong>{ isEmpty(this.state.address.notes) ? '-' : this.state.address.notes }</div>
								</div>
							</div>
						</div>
						<div id="qrcode" className="order-qrcode"></div>
					</div>
					<ul className="selected-items collection">
						{ this.state.items.map( item => <Item key={ item.id } { ...item } /> ) }
					</ul>
					<div className="order-amounts">
						<div className="titles">
							<h3 className="total" >Total</h3>
							<div className="tax">{`TVA ${config.tax}% incluse`}</div>
						</div>
						<div className="amount">
							<div className="tax">{ tax.toFixed( 2 ) }</div>
							<h3 className="total">{ totals.total.toLocaleString( 'fr-CH', { style: "currency", currency: "CHF" } ) }</h3>
						</div>
						<div className="greetings">Merci et bon appétit!</div>
					</div>
				</div>
				<div className="order-footer order-map">
					{ ! isEmpty(this.state.address) && <Gmap custId={ this.state.customer._id } addrId={ this.state.address.id } addAlerts={ this.props.addAlerts } /> }
				</div>
			</div>
		);
	}
}
Order.PropTypes = {
	id	: PropTypes.number.isRequired,
	addAlerts: PropTypes.func.isRequired,
};
