// Assets depedencies (Style & images)
import './complete.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import Order from 'components/ui-Order';

export default class CheckoutComplete extends React.Component {

	constructor( props ) {
		super( props );

		this.handlePrint = this.handlePrint.bind( this );
	}

	handlePrint( event ) {
		event.preventDefault();
		window.print();
	}

	render() {
		return (
			<section className={'checkout-step step-complete '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Confirmation</div>
				<div className="content">
					<h1>Confirmation</h1>
					<div className="checkout-process-action top">
						<Link to="/print/" onClick={ this.handlePrint } className="btn red checkout-print">Imprimer</Link>
					</div>
					{ this.props.active && <Order id={ this.props.id } addAlerts={this.props.addAlerts } /> }
					<div className="checkout-process-action">
						<Link to="/" className="btn red lighten-2 checkout-return">Fermer</Link>
						<Link to="/print/" onClick={ this.handlePrint } className="btn red checkout-print">Imprimer</Link>
					</div>
				</div>
			</section>
		);
	}
}
CheckoutComplete.PropTypes = {
	active	: PropTypes.bool,
	id			: PropTypes.number.isRequired,
	addAlerts: PropTypes.func.isRequired,
};
CheckoutComplete.defaultProps = {
	active: false,
};
