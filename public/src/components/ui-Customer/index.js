// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


// Components
import Gmap from 'components/ui-Gmap';
import Address from 'components/ui-Address';
import AddressForm from 'components/ui-AddressForm';

// Helpers
import isEmpty from 'lodash.isempty';

class Customer extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			gender			: null,
			firstname		: '',
			lastname		: '',
			email				: null,
			addresses		: [],
			showSidebar	: false,
		};

		this.openSidebar		= this.openSidebar.bind( this );
		this.closeSidebar		= this.closeSidebar.bind( this );

		this.Gmap					= this.Gmap.bind( this );
	}

	componentDidMount() {
		this.fetchCustomerData();
	}

	fetchCustomerData() {
		fetch( `/search/customer/${this.props.phone}/` )
			.then( res => res.json() )
			.then ( res => {
				if ( 1 === res.customers.length && !isEmpty(res.customers[0]) ) {
					this.setState( res.customers[0] );
				}
			} );
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
			this.fetchCustomerData();
		}
	}

	deleteAddress( addrId ) {
		if ( window.confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?") ) {
			fetch( `/customer/${this.props.phone}/address/${addrId}/`, { method: 'DELETE'} )
				.then( res => res.json() )
				.then( res => {
					if ( res ) {

						if ( ! isEmpty(res.alerts) ) {
							this.props.addAlerts( res.alerts );
						}

						this.closeSidebar( true );
						this.props.history.push( `/customer/${this.props.phone}/` );
					}
				} );
		}
	}

	Gmap({ match }) {
		return <Gmap addr={ this.state.addresses[ this.state.addresses.findIndex( addr => addr.id == match.params.addrId ) ] } addAlerts={this.props.addAlerts} />;
	}

	render() {

		const addressForm = ({ match }) => {
			let addr = isEmpty(match.params.addrId) ? {} : this.state.addresses[ this.state.addresses.findIndex( a => a.id == match.params.addrId ) ];
			return <AddressForm phone={match.params.number} {...addr} addAlerts={ this.props.addAlerts } closeSidebar={ this.closeSidebar } />;
		};

		return (
			<div className="customer">
				<div className="customer-details">
					<div className="card">
						<div className="card-content">
							<h1 className="card-title">{ this.props.phone }</h1>
							<h2>
								{ `${this.state.firstname} ${this.state.lastname}`  }
								{ ( !isEmpty(this.state.gender) ) && <small>({( 'mr' === this.state.gender ? 'Monsieur' : 'Madame' )})</small> }
							</h2>
							{ !isEmpty(this.state.email) && <p className="email"><a href={`mailto:${this.state.email}`}>{ this.state.email }</a></p> }
							<h3>Adresses</h3>
							<CSSTransitionGroup component="ul" className="addresses collection" transitionName={{ enter: 'add', leave: 'delete' }} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
								{ this.state.addresses.map( (addr) => <Address key={addr.id} phone={this.props.phone} {...addr} openSidebar={this.openSidebar} deleteAddress={this.deleteAddress.bind(this, addr.id)} /> ) }
							</CSSTransitionGroup>
						</div>
						<div className="card-action">
							<Link to={ `/customer/${this.props.phone}/address/add/` } onClick={ this.openSidebar } >Ajouter une adresse</Link>
						</div>
					</div>
				</div>
				<sidebar className={ 'white'+  ( this.state.showSidebar ? ' open' : '' ) }>
					<Link to={ `/customer/${this.props.phone}/` } className="close" onClick={ this.closeSidebar }>
						<i className="material-icons small">close</i>
					</Link>
					<Route exact path="/customer/:number/address/add/" component={ addressForm } />
					<Route exact path="/customer/:number/address/:addrId/edit/" component={ addressForm } />
					<Route exact path="/customer/:number/address/:addrId/directions/" render={ this.Gmap } />
				</sidebar>
			</div>
		);
	}

}
Customer.propTypes = {
	addr			: PropTypes.string,
	phone			: PropTypes.string.isRequired,
	addAlerts	: PropTypes.func.isRequired,
};

export default Customer;
