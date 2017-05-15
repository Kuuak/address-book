// Assets depedencies (Style & images)
import './index.css';
import './images/LEscaleGourmande-Logo-v2-blanc.png';

// React
import React from 'react';
import { Link } from 'react-router-dom';

class Nav extends React.Component {

	render() {
		return (
			<nav className="site-nav indigo">
				<div className="nav-wrapper">
					<Link to="/" className="brand-logo" >
						<img src="/dist/images/LEscaleGourmande-Logo-v2-blanc.png" alt="L'Escale Gourmande"/>
					</Link>
					<ul id="nav-mobile" className="right">
						<li>
							<Link to="/">
								<i className="large material-icons" title="Rechercher un client">search</i>
							</Link>
						</li>
						<li>
							<Link to="/customers/">
								<i className="large material-icons" title="Tous les clients">list</i>
							</Link>
						</li>
						<li>
							<Link to="/add/customer/">
								<i className="large material-icons" title="Ajouter un client">add</i>
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}

export default Nav;
