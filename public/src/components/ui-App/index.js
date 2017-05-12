// Assets depedencies (Style & images)
import 'materialize/css/materialize.min.css';
import 'styles/base.css';
import './index.css';

// React
import React from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom';

// Components
import Nav from 'components/ui-Nav';
import Alerts from 'components/ui-Alerts';
import SearchBar from 'components/ui-SearchBar';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';
import uniqueId from 'lodash.uniqueid';

class App extends React.Component {

	constructor( props ) {
		super( props );

		// Set the initial states
		this.state = {
			alerts			: [],
			searchValue	: '',
		};

		// Bind functions to current `this`instance
		this.addAlerts					= this.addAlerts.bind(this);
		this.dismissAlert				= this.dismissAlert.bind(this);
		this.handleChangeSearch	= this.handleChangeSearch.bind( this );
	}

	componentDidMount() {
		if ( typeof io !== undefined ) {
			this.socket = io.connect( 'http://kuuak.dev:8080' );
		}
	}

	handleChangeSearch( value ) {

		if ( !isEmpty(value) && value.length > 2 ) {
			// TODO Perform search
		}
		else {
			// TODO Set empty results
		}

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


	render() {

		return (
			<BrowserRouter>
				<div>
					<Alerts alerts={this.state.alerts} dismiss={this.dismissAlert} />
					<header className="page-header" >
						<div className="container">
							<Nav />
							<Route exact path="/" render={ () => (
								<SearchBar searchValue={this.state.searchValue} onChange={this.handleChangeSearch} />
							)}/>
						</div>
					</header>
					<main>
						// Content
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
		)
	}
}

// Render the App component in HTML page
ReactDom.render( <App />, document.getElementById('app') );
