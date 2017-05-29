// Assets depedencies (Style & images)
import './index.css';
import 'styles/appears.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';

// Helpers
import isEmpty from 'lodash.isempty';

export default class ResultCostumer extends React.Component {

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
									<Link to={`/order/delivery/?customer=${this.props._id}&address=${addr.id}`} className="material-icons">local_shipping</Link>
								</li>
							) )
						}
					</ul>
				</div>
				<div className="card-action">
					<Link to={`/customer/${this.props._id}/`} >Voir la fiche client</Link>
				</div>
			</li>
		);
	}

}
