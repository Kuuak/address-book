// Assets depedencies (Style & images)
import './index.css';
import 'styles/appears.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';

// Helpers
import isEmpty from 'lodash.isempty';

class ResultCostumer extends React.Component {

	render() {

		return (
			<li className="result-costumer card" style={{transitionDelay: (this.props.id*75) +'ms'}}>
				<div className="card-content">
					<div className="card-title">{this.props.phone}</div>
					<div className="name">{this.props.firstname} {this.props.lastname}</div>
					<ul className="collection">
						{
							this.props.addresses.map( (addr, i) => (
								<li className="collection-item" key={i}>
									<address>
										<span className="street">{addr.street}</span>&nbsp;
										<span className="number">{addr.number},</span>&nbsp;
										<span className="postcode">{addr.postcode}</span>&nbsp;
										<span className="city">{addr.city}</span>&nbsp;
									</address>
									<Link to={`/customer/${this.props.phone}/`} className="btn blue accent-2 waves-effect waves-light">
										<i className="material-icons">local_shipping</i>
									</Link>
								</li>
							) )
						}
					</ul>
				</div>
			</li>
		);
	}

}

export default ResultCostumer
