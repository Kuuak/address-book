// Assets depedencies (Style & images)
import 'materialize/css/materialize.min.css';

// React
import React from 'react';
import ReactDom from 'react-dom';

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
			<div>
				// Alerts
				<header className="page-header indigo" >
					<div className="container">
						// Nav bar
						// Search box
					</div>
				</header>
				// Content
				<footer className="page-footer indigo">
					<div className="footer-copyright">
						<div className="container">
							© 2017 L'Escale Gourmande
						</div>
					</div>
				</footer>
			</div>
		)
	}
}

// Render the App components in HTML page
ReactDom.render( <App />, document.getElementById('app') );
