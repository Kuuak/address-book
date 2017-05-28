// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';


// Components
import Gmap from 'components/ui-Gmap';
import Address from 'components/ui-Address';
import Card from 'components/ui-Customer/card';
import AddressForm from 'components/ui-CustomerForm/address';
import CustomerFormDetails from 'components/ui-CustomerForm/details';

// Helpers
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';

class Customer extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			showSidebar	: false,
			loading			: true,
		};

		this.openSidebar		= this.openSidebar.bind( this );
		this.closeSidebar		= this.closeSidebar.bind( this );
		this.deleteCustomer	= this.deleteCustomer.bind( this );
		this.handleCardClick	= this.handleCardClick.bind( this );

		this.Gmap					= this.Gmap.bind( this );
	}

	componentDidMount() {
		if ( this.props.location.pathname.match( /\/edit|add|directions\/?/ ) ) {
			this.openSidebar();
		}
	}

	handleCardClick( event, id, addrId ) {

		switch ( event.target.rel ) {
			case 'edit':
			case 'add':
			case 'address-directions':
			case 'address-edit':
				this.openSidebar();
				break;

			case 'delete':
				this.deleteCustomer( event );
				break;

			case 'address-delete':
				this.deleteAddress( event, addrId );
				break;
		}
	}

	openSidebar() {

		if ( ! this.state.showSidebar ) {
			this.setState({
				showSidebar: true,
			});
		}
	}
	closeSidebar( refreshData ) {
		this.setState({
			showSidebar: false,
		});

		if ( refreshData || false ) {
			this.card.getCustomer();
		}
	}

	deleteCustomer( event ) {
		if ( window.confirm("Êtes-vous sûr de vouloir supprimer cet client ?") ) {
			fetch( `/customer/${this.props.id}/`, { method: 'DELETE'} )
				.then( res => res.json() )
				.then( res => {
					if ( res ) {

						if ( ! isEmpty(res.alerts) ) {
							this.props.addAlerts( res.alerts );
						}

						if ( res.success ) {
							this.props.history.push( `/customers/` );
						}
					}
				} );
		}
		else {
			event.preventDefault();
		}
	}
	deleteAddress( event, addrId ) {
		if ( window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?") ) {
			fetch( `/customer/${this.props.id}/address/${addrId}/`, { method: 'DELETE'} )
				.then( res => res.json() )
				.then( res => {
					if ( res ) {

						if ( ! isEmpty(res.alerts) ) {
							this.props.addAlerts( res.alerts );
						}

						this.closeSidebar( true );
						this.props.history.push( `/customer/${this.props.id}/` );
					}
				} );
		}
		else {
			event.preventDefault();
		}
	}

	Gmap({ match }) {
		return <Gmap custId={ this.props.id } addrId={ parseInt(match.params.addrId) } addAlerts={this.props.addAlerts} />;
	}

	render() {
		const submitSuccess = () => {
			this.closeSidebar( true );
			this.props.history.push( `/customer/${this.props.id}/` );
		};
		const addressForm = ({ match }) => {
			return <AddressForm id={ parseInt(match.params.addrId) } custId={ parseInt(match.params.custId) } addAlerts={ this.props.addAlerts } onSubmitSucess={ submitSuccess } />;
		};
		const customerForm = ({ match, history }) => {
			return <CustomerFormDetails id={ parseInt(match.params.custId) } addAlerts={ this.props.addAlerts } onSubmitSucess={ submitSuccess } />;
		};

		return (
			<div className="customer">
				<div className="customer-details">
					<Card id={ this.props.id } onClick={ this.handleCardClick } addAlerts={ this.props.addAlerts } location={ `/customer/${this.props.id}/` } ref={ card => this.card = card } />
				</div>
				<aside className={ 'white'+  ( this.state.showSidebar ? ' open' : '' ) }>
					<Link to={ `/customer/${this.props.id}/` } className="close" onClick={ this.closeSidebar }>
						<i className="material-icons small">close</i>
					</Link>
					<Route exact path="/customer/:custId/edit/" render={ customerForm } />

					<Route exact path="/customer/:custId/address/add/" component={ addressForm } />
					<Route exact path="/customer/:custId/address/:addrId/edit/" component={ addressForm } />

					<Route exact path="/customer/:custId/address/:addrId/directions/" render={ this.Gmap } />
				</aside>
			</div>
		);
	}

}
Customer.propTypes = {
	id				: PropTypes.number.isRequired,
	addAlerts	: PropTypes.func.isRequired,
	history		: PropTypes.object.isRequired,
	location	: PropTypes.object.isRequired,
};

export default Customer;
