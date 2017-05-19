// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


// Components
import Gmap from 'components/ui-Gmap';

// Helpers
import isNull from 'lodash.isnull';
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

	closeSidebar() {
		this.setState({
			showSidebar: false,
		});
	}
	Gmap({ match }) {
		return <Gmap addr={ this.state.addresses[ this.state.addresses.findIndex( addr => addr.id == match.params.addrId ) ] } addAlerts={this.props.addAlerts} />;
	}

	render() {
		return (
			<div className="customer">
				<div className="customer-details">
					<div className="wrap">
						<h1>{ this.props.phone }</h1>
						<h2>
							{ `${this.state.firstname} ${this.state.lastname}`  }
							{ ( !isEmpty(this.state.gender) ) && <small>({( 'mr' === this.state.gender ? 'Monsieur' : 'Madame' )})</small> }
						</h2>
						{ !isEmpty(this.state.email) && <p className="email"><a href={`mailto:${this.state.email}`}>{ this.state.email }</a></p> }
						<h3>Adresses</h3>
						<ul className="addresses collection">{
							this.state.addresses.map( (addr, i) => (
								<li className="collection-item" key={i}>
									<address>
										<div>
											<span className="street">{addr.street}</span>&nbsp;
											<span className="number">{addr.number}</span>
										</div>
										<div>
											<span className="postcode">{addr.postcode}</span>&nbsp;
											<span className="city">{addr.city}</span>
										</div>
										{ ( ! isEmpty(addr.doorcode) ) && <div><strong>Code de porte</strong> : <span>{this.doorcode}</span></div> }
										{ ( ! isEmpty(addr.floor) ) && <div><strong>Étage</strong> : <span>{this.floor}</span></div> }
										{ ( ! isEmpty(addr.note) ) && <div><strong>information complémentaire</strong> : <span>{this.note}</span></div> }
										<div className="addr-actions">
											<Link to={`/customer/${this.props.phone}/address/${i}/directions/`} onClick={this.openSidebar}><i className="material-icons direction">directions</i></Link>
										</div>
									</address>
								</li>
							) )
						}</ul>
					</div>
				</div>
				<sidebar className={ ( this.state.showSidebar ? 'open' : '' ) }>
					<Link to={ `/customer/${this.props.phone}/` } onClick={ this.closeSidebar }>
						<i className="close material-icons small">close</i>
					</Link>
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
