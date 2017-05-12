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
				</div>
			</nav>
		);
	}
}

export default Nav;
