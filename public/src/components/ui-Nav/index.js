// Assets depedencies (Style & images)
import './index.css';
import logoSrc from 'images/_logo.png';

// React
import React from 'react';
import { Link } from 'react-router-dom';

export default class Nav extends React.Component {

	render() {
		return (
			<nav className="site-nav indigo">
				<div className="nav-wrapper">
					<Link to="/" className="brand-logo" >
						<img src={ logoSrc } alt="L'Escale Gourmande"/>
					</Link>
					<ul id="nav-mobile" className="right">
						<li>
							<Link to="/">
								<i className="large material-icons" title="Rechercher un client">search</i>
							</Link>
						</li>
						<li>
							<Link to="/orders/">
								<i className="large material-icons" title="Commandes">list</i>
							</Link>
						</li>
						<li>
							<Link to="/add/customer/">
								<i className="large material-icons" title="Ajouter un client">supervisor_account</i>
							</Link>
						</li>
						<li>
							<Link to="/dishes-ingredients/">
								<i className="large material-icons" title="Gérer les plats et suppléments">restaurant_menu</i>
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		);
	}
}
