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
import SearchBar from 'components/ui-SearchBar';

// Helpers
import isEmpty from 'lodash.isempty';

class App extends React.Component {

	constructor( props ) {
		super( props );

		// Set the initial states
		this.state = {
			searchValue: '',
		};

		// Bind functions to current `this`instance
		this.handleChangeSearch = this.handleChangeSearch.bind( this );
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

	render() {

		return (
			<BrowserRouter>
				<div>
					// Alerts
					<header className="page-header indigo" >
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
