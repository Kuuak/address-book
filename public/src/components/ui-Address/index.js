// Assets depedencies (Style & images)
import 'styles/fade.css';
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import isEmpty from 'lodash.isempty';

class Address extends React.Component {

	render() {
		return (
			<li className="address collection-item">
				<div className="details">
					<div>
						<span className="street">{this.props.street}</span>&nbsp;
						<span className="number">{this.props.number}</span>
					</div>
					<div>
						<span className="postcode">{this.props.postcode}</span>&nbsp;
						<span className="city">{this.props.city}</span>
					</div>
					<Route path="/customer/:custId" render={ () => {
						return (
							<div className="actions">
								<Link to={ `/order/customer/${this.props.custId}/address/${this.props.id}` } >
									<i className="material-icons direction">local_shipping</i>
								</Link>
								<Link to={`/customer/${this.props.custId}/address/${this.props.id}/directions/`} onClick={ this.props.openSidebar }>
									<i className="material-icons direction">directions</i>
								</Link>
								<Link to={`/customer/${this.props.custId}/address/${this.props.id}/edit/`} onClick={ this.props.openSidebar }>
									<i className="material-icons edit">edit</i>
								</Link>
								<Link to={`/customer/${this.props.custId}/address/${this.props.id}/delete/`} onClick={ this.props.deleteAddress }>
									<i className="material-icons delete">delete</i>
								</Link>
							</div>
						)
					} } />
				</div>
				<div className="extra">
					{ ( ! isEmpty(this.props.doorcode) ) && <div><strong>Code de porte:</strong> <span>{this.props.doorcode}</span></div> }
					{ ( ! isEmpty(this.props.floor) ) && <div><strong>Étage:</strong> <span>{this.props.floor}</span></div> }
					{ ( ! isEmpty(this.props.notes) ) && <div><strong>information:</strong> <span>{this.props.notes}</span></div> }
				</div>
			</li>
		);
	}
}
Address.propTypes = {
	id						: PropTypes.number.isRequired,
	custId				: PropTypes.number.isRequired,
	street				: PropTypes.string.isRequired,
	number				: PropTypes.string.isRequired,
	postcode			: PropTypes.string.isRequired,
	city					: PropTypes.string.isRequired,
	doorcode			: PropTypes.string,
	floor					: PropTypes.string,
	note					: PropTypes.string,
	openSidebar		: PropTypes.func,
	deleteAddress	: PropTypes.func,
};

export default Address;
