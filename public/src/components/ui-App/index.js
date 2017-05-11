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

class App extends React.Component {

	constructor( props ) {
		super( props );
	}

	componentDidMount() {
		if ( typeof io !== undefined ) {
			this.socket = io.connect( 'http://kuuak.dev:8080' );
		}
	}

	render() {

		return (
			<BrowserRouter>
				<div>
					// Alerts
					<header className="page-header indigo" >
						<div className="container">
							<Nav />
							// Search box
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

// Render the App components in HTML page
ReactDom.render( <App />, document.getElementById('app') );
