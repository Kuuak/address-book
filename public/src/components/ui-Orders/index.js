// Assets depedencies (Style & images)
import 'styles/fade.css';
import './index.css';

// React
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Preloader from 'components/ui-Preloader';

// Helpers
import isEmpty from 'lodash.isempty';
import formatDate from 'includes/formatDate';
import calcItemsTotal from 'includes/calcItemsTotal';


export default class Orders extends React.Component {

	constructor( props ) {
		super(props);

		this.state = {
			loading: true,
		};
	}

	componentDidMount() {
		fetch( '/orders/', { headers: new Headers({ 'Accept': 'application/json' }) } )
			.then( res => res.json() )
			.then( res => {
				this.setState({
					loading: false,
					orders: res.orders,
				})
			} );
	}

	render() {
		return (
			<div className="order-all">
				<h1>Toutes les commandes</h1>
				<Preloader active={this.state.loading} />
				<CSSTransitionGroup component="ul" className="orders" transitionName="appears" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{ this.state.orders && this.state.orders.map( (order, i) => <ResultOrder key={order._id} {...order} /> ) }
				</CSSTransitionGroup>
			</div>
		);
	}
}

export class ResultOrder extends React.Component {

	render() {
		return (
			<li className="result-order card">
				<div className="card-content">
					<div className="card-title">Commande n° <strong>{ this.props._id.toLocaleString("arab",{minimumIntegerDigits:4, useGrouping: false}) }</strong></div>
					<div className="date"><strong>Date</strong> { formatDate( this.props.date ) }</div>
					<div className="amount"><strong>Total</strong> { calcItemsTotal( this.props.items ).toLocaleString( 'fr-CH', { style: "currency", currency: "CHF" } ) }</div>
				</div>
				<div className="card-action">
					<Link to={`/order/${this.props._id}/`} >Voir la commande</Link>
				</div>
			</li>
		);
	}
}
ResultOrder.PropTypes = {
	_id		: PropTypes.number.isRequired,
	date	: PropTypes.number.isRequired,
	items	: PropTypes.array.isRequired,

}
