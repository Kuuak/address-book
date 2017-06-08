// Assets depedencies (Style & images)
import 'materialize/css/materialize.min.css';
import 'styles/base.css';
import './index.css';
import './print.css';

// React
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

// Components
import Nav from 'components/ui-Nav';
import Alerts from 'components/ui-Alerts';
import Results from 'components/ui-Results';
import Customer from 'components/ui-Customer';
import SearchBar from 'components/ui-SearchBar';
import CustomerForm from 'components/ui-CustomerForm/customer';
import Checkout from 'components/ui-Checkout';
import Order from 'components/ui-Order';
import Orders from 'components/ui-Orders';

// Helpers
import isNil from 'lodash.isnil';
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import uniqueId from 'lodash.uniqueid';
import formatPhone from 'includes/formatPhone';


export default class App extends React.Component {

	constructor( props ) {
		super( props );

		// Set the initial states
		this.state = {
			alerts			: [],
			searchValue	: '',
			customers		: {
				items		: [],
				loading	: false,
			},
			suggestions	: {
				items				: [],
				loading			: false,
				totalResults: null,
			},
			currentCall: {
				status	: null,
				number	: null,
				alertId	: 0,
			}
		};

		// Bind functions to current `this`instance
		this.addAlerts							= this.addAlerts.bind(this);
		this.dismissAlert						= this.dismissAlert.bind(this);
		this.callMonitorEvent				= this.callMonitorEvent.bind(this);
		this.handleChangeSearch			= this.handleChangeSearch.bind( this );
		this.copyCurrentCallNumber	= this.copyCurrentCallNumber.bind(this);
	}

	componentDidMount() {
		if ( typeof io !== undefined ) {
			this.socket = io.connect( window.location.origin );

			// Listen to emmitted events from the Call Monitor server
			this.socket
				.on( 'inbound'			, data => this.callMonitorEvent( 'inbound' , data ) )
				.on( 'connected'		, data => this.callMonitorEvent( 'connected' , data ) )
				.on( 'disconnected'	, data => this.callMonitorEvent( 'disconnected' , data ) );
		}

		this.searchCustomer();
	}

	callMonitorEvent( status, data ) {

		const phoneNumber = data.replace( '041', '' );
		if ( status == this.state.currentCall.status && phoneNumber == this.state.currentCall.number ) {
			return;
		}

		this.dismissAlert( this.state.currentCall.alertId );

		const callAlert		= {
			status			: ( 'disconnected' === status ? 'error' : ( 'inbound' === status ? 'info' : 'success' ) ),
			title				: ( 'disconnected' === status ? 'Appel terminé' : ( 'inbound' === status ? 'Appel entrant' : 'Appel en cours' ) ),
			message			: formatPhone(phoneNumber),
			icon				: ( 'disconnected' === status ? 'call_end' : ( 'inbound' === status ? 'settings_phone' : 'call' ) ),
			handleClick	: this.copyCurrentCallNumber,
			titleButton	: 'Rechercher',
		};

		this.setState({
			currentCall: {
				status	: status,
				number	: phoneNumber,
				alertId	: parseInt( this.addAlerts( callAlert ) )
			}
		});
	}

	copyCurrentCallNumber () {

		if ( ! isNull(this.state.currentCall.number) ) {
			this.setState({ searchValue: this.state.currentCall.number });
			this.handleChangeSearch( this.state.currentCall.number );
			return true;
		}

		return false;
	}

	handleChangeSearch( value ) {

		this.searchCustomer( value );
		this.searchSuggestion( value );

		this.setState({ searchValue: value });
	}

	addAlerts( alerts ) {

		if ( isNull(alerts) ) {
			return;
		}

		if ( !Array.isArray(alerts) ) {
			alerts = Array(alerts);
		}

		alerts = alerts.map( (alert) => {
			alert.id = parseInt( uniqueId() );
			return alert;
		} );

		this.setState({ alerts: [...this.state.alerts, ...alerts] });

		return alerts.map( (alert) => alert.id );
	}

	dismissAlert( alertId ) {
		let tmpAlerts = this.state.alerts;
		let index			= tmpAlerts.findIndex( (alert) => ( alert.id === alertId ) );

		if ( 0 <= index ) {
			tmpAlerts.splice( index, 1 );
			this.setState({ alerts: tmpAlerts });

			return true;
		}

		return false;
	}

	searchCustomer( value ) {

		value = value || '';

		this.setState({ customers: {
			loading: true,
		} });

		fetch( `/search/customer/${value}` )
			.then( res => res.json() )
			.then( res => {
				if ( ! isNil(res.alerts) ) {
					this.addAlerts( res.alerts );
					res = [];
				}
				this.setState({ customers: {
					loading: false,
					items: res.customers,
				} });
			} );
	}

	searchSuggestion( value ) {

		this.setState({ suggestions: {
			items				: [],
			loading			: true,
			totalResults: null,
			}
		});

		if ( isEmpty(value) || value.length < 3 ) {
			return;
		}

		fetch( `/search/suggestion/${value}/` )
			.then( res => res.json() )
			.then( res => {
				if ( ! isNil(res.alerts) ) {
					this.addAlerts( res.alerts );
				}

				if ( isNull(res.suggestions) || !Array.isArray(res.suggestions) ) {
					res.suggestions = [];
				}

				// Always add an extra suggestion to register a new customer with the current phone searched
				res.suggestions.push({
					phone: value,
					extra: true,
				});

				this.setState({ suggestions: {
					loading			: false,
					items				: res.suggestions,
					totalResults: res.totalResults,
				} });
			} );
	}

	render() {
		return (
			<BrowserRouter>
				<div className="app-wrapper">
					<header className="page-header" >
						<Nav />
						<Route exact path="/" render={ () => <SearchBar searchValue={this.state.searchValue} onChange={this.handleChangeSearch} /> }/>
					</header>
					<main>
						<Alerts alerts={this.state.alerts} dismiss={this.dismissAlert} />
						<Route exact path="/" render={ () => <Results customers={this.state.customers} suggestions={this.state.suggestions} /> } />
						<Route path="/customer/:id" render={ ({ match, location, history } ) => <Customer id={ parseInt(match.params.id) } location={location} history={history} addAlerts={this.addAlerts} /> } />
						<Route path="/add/customer/:suggestId?" render={ ({ match, history }) => {
							let suggestion = null;
							if ( ! isNull( match.params.suggestId ) ) {
								suggestion = this.state.suggestions.items[ match.params.suggestId ];
							}
							return <CustomerForm suggest={ suggestion } history={ history } addAlerts={ this.addAlerts } />;
						}} />
						<Route path="/checkout/:step" render={ ({ match, history, location }) => {
							let query = new URLSearchParams( location.search );
							return <Checkout step={ match.params.step } orderId={parseInt(query.get('order'))} custId={parseInt(query.get('customer'))} addrId={parseInt(query.get('address'))} history={history} addAlerts={this.addAlerts} />;
						} } />
						<Route path="/orders/" render={ () => <Orders /> } />
						<Route path="/order/:id" render={ ({ match }) => <Order id={ match.params.id } addAlerts={this.addAlerts} /> } />
					</main>
					<footer className="page-footer indigo">
						<div className="footer-copyright">
							<div className="container">
								© 2017 L'Escale Gourmande
							</div>
						</div>
					</footer>
				</div>
			</BrowserRouter>
		);

	}
}

// Render the App component in HTML page
ReactDom.render( <App />, document.getElementById('app') );
