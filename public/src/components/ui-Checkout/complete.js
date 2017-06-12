// Assets depedencies (Style & images)
import './complete.css';

// APP settings
import config from '../../../../config';

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
		this.onAfterPrint = this.onAfterPrint.bind( this );
		this.mediaQueryListener = this.mediaQueryListener.bind( this );
	}

	componentDidMount() {

		if (window.matchMedia) {
			this.mediaQueryList = window.matchMedia('print');
			this.mediaQueryList.addListener( this.mediaQueryListener );
		}

		window.onafterprint = this.onAfterPrint;
	}

	componentWillUnmount() {
		if (window.matchMedia) {
			this.mediaQueryList.removeListener( this.mediaQueryListener );
		}
		window.onafterprint = null;
	}

	mediaQueryListener( mql ) {
		if (!mql.matches) {
			this.onAfterPrint();
		}
	}

	onAfterPrint( a, b ) {
		this.numberPrinted++;
		if ( !isNaN(this.numberPrinted) && this.numberPrinted < config.print.number ) {
			window.print();
		}
		else {
			this.numberPrinted = undefined;
		}
	}

	handlePrint( event ) {
		event.preventDefault();
		this.numberPrinted = 0;
		window.print();
	}

	render() {
		return (
			<section className={'checkout-step step-complete '+ ( this.props.active && 'step-active' ) }>
				<div className="lateral">Confirmation</div>
				<div className="content">
					<h1>Confirmation</h1>
					<div className="checkout-process-action top">
						<Link to="/print/" onClick={ this.handlePrint } className="btn red checkout-print">Imprimer (2 copies)</Link>
					</div>
					{ this.props.active && <Order id={ this.props.id } addAlerts={this.props.addAlerts } /> }
					<div className="checkout-process-action">
						<Link to="/" className="btn red lighten-2 checkout-return">Fermer</Link>
						<Link to="/print/" onClick={ this.handlePrint } className="btn red checkout-print">Imprimer (2 copies)</Link>
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
